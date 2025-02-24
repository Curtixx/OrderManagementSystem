using ApiTmb.Orders;
using Microsoft.EntityFrameworkCore;

namespace ApiTmb.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Order> Order { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=db;Port=5432;Database=ApiTMB;Username=admin;Password=2604");
            }
        }
    }
}
