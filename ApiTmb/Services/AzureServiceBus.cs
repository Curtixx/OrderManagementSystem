using Azure.Messaging.ServiceBus;
using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ApiTmb.Services
{
    public class AzureServiceBus
    {
        private readonly string _connectionString;
        private readonly string _queueName;

        public AzureServiceBus(string connectionString, string queueName)
        {
            _connectionString = connectionString;
            _queueName = queueName;
        }

        public async Task SendMessage(object mensagem)
        {
            await using var client = new ServiceBusClient(_connectionString);
            ServiceBusSender sender = client.CreateSender(_queueName);

            string mensagemJson = JsonSerializer.Serialize(mensagem);
            ServiceBusMessage message = new ServiceBusMessage(Encoding.UTF8.GetBytes(mensagemJson));

            await sender.SendMessageAsync(message);
        }
    }
}
