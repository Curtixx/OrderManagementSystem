using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ApiTmb.Data;
using ApiTmb.Orders;
using Microsoft.Extensions.DependencyInjection;

namespace ApiTmb.Workers
{
    public class ServiceBusWorker : BackgroundService
    {
        private readonly ILogger<ServiceBusWorker> _logger;
        private readonly ServiceBusClient _client;
        private readonly ServiceBusProcessor _processor;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly string _serviceBusConnectionString;
        private readonly string _queueName;

        public ServiceBusWorker(ILogger<ServiceBusWorker> logger, IServiceScopeFactory scopeFactory, IConfiguration configuration)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
            _serviceBusConnectionString = configuration["AzureServiceBus:ConnectionString"];
            _queueName = configuration["AzureServiceBus:QueueName"];
            _client = new ServiceBusClient(_serviceBusConnectionString);
            _processor = _client.CreateProcessor(_queueName, new ServiceBusProcessorOptions());
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _processor.ProcessMessageAsync += ProcessMessageAsync;
            _processor.ProcessErrorAsync += ProcessErrorAsync;

            await _processor.StartProcessingAsync(stoppingToken);
        }

        private async Task ProcessMessageAsync(ProcessMessageEventArgs args)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                try
                {
                    var messageData = JsonSerializer.Deserialize<ServiceBusMessage>(args.Message.Body.ToString());
                    Console.WriteLine(messageData);
                    var orderId = messageData?.OrderId;

                    if (string.IsNullOrEmpty(orderId))
                    {
                        _logger.LogError("Mensagem inválida recebida.");
                        await args.AbandonMessageAsync(args.Message);
                        return;
                    }

                    if (!Guid.TryParse(orderId, out var orderGuid))
                    {
                        _logger.LogError($"Formato inválido para OrderId: {orderId}");
                        await args.AbandonMessageAsync(args.Message);
                        return;
                    }

                    var order = await context.Order.FindAsync(orderGuid);

                    if (order != null)
                    {
                        order.Status = "Processando";
                        await context.SaveChangesAsync();
                        _logger.LogInformation($"Pedido {orderId} atualizado para Processando.");

                        await Task.Delay(5000, args.CancellationToken);

                        order.Status = "Finalizado";
                        await context.SaveChangesAsync();
                        _logger.LogInformation($"Pedido {orderId} atualizado para 'Finalizado'.");

                        await args.CompleteMessageAsync(args.Message);
                    }
                    else
                    {
                        _logger.LogWarning($"Pedido {orderId} não encontrado.");
                        await args.AbandonMessageAsync(args.Message);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erro ao processar mensagem: {ex.Message}");
                    await args.AbandonMessageAsync(args.Message);
                }
            }
        }

        private Task ProcessErrorAsync(ProcessErrorEventArgs args)
        {
            _logger.LogError($"Erro no Service Bus: {args.Exception.Message}");
            return Task.CompletedTask;
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            await _processor.CloseAsync();
            await _client.DisposeAsync();
            await base.StopAsync(cancellationToken);
        }
    }

    public class ServiceBusMessage
    {
        public string OrderId { get; set; }
    }
}