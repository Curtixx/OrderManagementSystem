namespace ApiTmb.Orders
{
    public class Order
    {
        public Guid Id { get; init; }
        public string Client { get; set; }
        public string Product { get; set; }
        public decimal Value { get; set; }
        public string Status { get; set; }
        public DateTime Created_at { get; set; }

        public Order(string client, string product, decimal value, string status)
        {
            Id = Guid.NewGuid();
            Client = client;
            Product = product;
            Value = value;
            Status = status;
            Created_at = DateTime.UtcNow;
        }
    }
}
