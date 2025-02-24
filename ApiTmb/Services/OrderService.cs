using ApiTmb.Data;
using ApiTmb.Orders;
using ApiTmb.Requests;
using Microsoft.EntityFrameworkCore;

namespace ApiTmb.Services
{
    public class OrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateOrder(CreateOrderRequest request, AzureServiceBus serviceBus)
        {
            var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (!string.Equals(request.status, "Pendente", StringComparison.OrdinalIgnoreCase))
                {
                    throw new Exception(string.Format("O status do pedido deve iniciar como pendente!"));
                }

                var order = new Order(request.client, request.product, request.value, request.status);
                await _context.Order.AddAsync(order);
                await _context.SaveChangesAsync();

                await serviceBus.SendMessage(new
                {
                    OrderId = order.Id,
                    order.Client,
                    order.Value,
                    order.Status,
                });

                await transaction.CommitAsync();
                return order;
            }
            catch (Exception ex)
            {
                transaction.RollbackAsync();
                throw new Exception(string.Format(ex.Message));
            }
        }

        public async Task<Order> UpdateOrder(Guid id, UpdateOrderRequest request)
        {
            var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.Order.SingleOrDefaultAsync(order => order.Id == id);

                if (order == null)
                {
                    throw new Exception(string.Format("Não foi possivel achar o pedido"));
                }

                order.Client = request.client;
                order.Value = request.value;
                order.Product = request.product;

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return order;
            }
            catch (Exception ex)
            {
                transaction.RollbackAsync();
                throw new Exception($"Erro ao excluir o pedido: {ex.Message}");
            }
        }

        public async Task<bool> DeleteOrder(Guid id)
        {
            var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.Order.SingleOrDefaultAsync(order => order.Id == id);

                if (order == null)
                {
                    throw new Exception("O pedido não foi encontrado.");
                }

                _context.Order.Remove(order);
                var result = await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                transaction.RollbackAsync();
                throw new Exception($"Erro ao excluir o pedido: {ex.Message}");
            }
        }


        public async Task<IEnumerable<Order>> AllOrders()
        {
            try
            {
                return await _context.Order.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(string.Format(ex.Message));
            }
        }

        public async Task<Order> ShowOrder(Guid id)
        {
            try
            {
                return await _context.Order.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new KeyNotFoundException(string.Format(ex.Message));
            }
        }

    }
}
