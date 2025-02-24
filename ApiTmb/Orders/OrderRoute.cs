using ApiTmb.Data;
using ApiTmb.Requests;
using ApiTmb.Services;

namespace ApiTmb.Orders
{
    public static class OrderRoute
    {
        public static void addRoutesOrders(WebApplication app)
        {
            var groupOrderRoute = app.MapGroup("orders");
            
            groupOrderRoute.MapPost("", async (CreateOrderRequest request, OrderService orderService, AzureServiceBus serviceBus) => {
                try
                {
                    var createOrder = await orderService.CreateOrder(request, serviceBus);
                    return Results.Created($"/orders/{createOrder.Id}", createOrder);
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500);
                }
            });

            groupOrderRoute.MapDelete("/{id:guid}", async (Guid id, OrderService orderService) =>
            {
                try
                {
                    var result = await orderService.DeleteOrder(id);

                    if (result)
                    {
                        return Results.Ok("Pedido excluído com sucesso.");
                    }

                    return Results.NotFound("Pedido não encontrado."); 
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500);
                }
            });

            groupOrderRoute.MapPatch("/{id:guid}", async(Guid id, UpdateOrderRequest request, OrderService orderService) => {
                try
                {
                    var createOrder = await orderService.UpdateOrder(id, request);
                    return Results.Created($"/orders/{createOrder.Id}", createOrder);
                } catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500);
                }
            });

            groupOrderRoute.MapGet("", async (OrderService orderService) => {
                try
                {
                    return Results.Ok(await orderService.AllOrders());
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500);
                }
            });

            groupOrderRoute.MapGet("/{id:guid}", async (Guid id, OrderService orderService) =>
            {
                try
                {
                    var order = await orderService.ShowOrder(id);

                    if (order == null)
                    {
                        return Results.NotFound("Order not found");
                    }

                    return Results.Ok(order);
                }
                catch (Exception ex)
                {
                    return Results.Problem(detail: ex.Message, statusCode: 500);
                }
            });

        }
    }
}
   