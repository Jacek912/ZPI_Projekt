using Microsoft.EntityFrameworkCore;
using wms_api.Model;

namespace wms_api.Database
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<OperationLog> OperationLogs { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<StorageLocation> StorageLocations { get; set; }
        public DbSet<StorageLocationProduct> StorageLocationProducts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=db_api_wms;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StorageLocationProduct>().HasKey(k => new
            {
                k.StorageLocationId,
                k.ProductId
            });
            base.OnModelCreating(modelBuilder);
        }
    }
}
