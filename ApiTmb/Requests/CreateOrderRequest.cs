using System.ComponentModel.DataAnnotations;

namespace ApiTmb.Requests
{
    public record CreateOrderRequest(
        [Required(ErrorMessage = "O nome do cliente é obrigatório.")]
        string client,
        [Required(ErrorMessage = "É necessário colocar um produto.")]
        string product,
        [Range(0.01, double.MaxValue, ErrorMessage = "O total deve ser maior que zero.")]
        decimal value,
        [Required(ErrorMessage = "O status do pedido e obrigatório.")]
        string status
     );
}
