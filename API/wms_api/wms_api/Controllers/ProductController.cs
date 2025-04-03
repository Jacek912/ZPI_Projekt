using Microsoft.AspNetCore.Mvc;
using wms_api.Database;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ILogger<ProductController> _logger;
        private readonly AppDbContext _dbContext;

        public ProductController(ILogger<ProductController> logger)
        {
            _logger = logger;
            var dbContext = ContextCreator.dbContext;
            if (dbContext == null)
            {
                throw new Exception("Null dbcontext!");
            }
            _dbContext = dbContext;
        }

        [HttpPost]
        public Product? Post(Product product)
        {
            var newProduct = new Product
            {
                Name = product.Name,
                Description = product.Description,
                Amount = product.Amount,
                Category = product.Category
            };
            _dbContext.Products.Add(product);
            _dbContext.SaveChanges();
            return product;
        }

        [HttpGet]
        public IEnumerable<Product> Get()
        {
            return _dbContext.Products;
        }

        [HttpPut]
        public string Put(Product product)
        {
            var targetProduct = _dbContext.Products.FirstOrDefault(x => x.Id == product.Id);
            if (targetProduct == null)
            {
                return "No product with id: " + product.Id;
            }
            targetProduct.Name = product.Name;
            targetProduct.Description = product.Description;
            targetProduct.Amount = product.Amount;
            targetProduct.Category = product.Category;
            _dbContext.Update(targetProduct);
            _dbContext.SaveChanges();
            return "Updated!";
        }

        [HttpDelete]
        public string Delete(int id)
        {
            var targetProduct = _dbContext.Products.FirstOrDefault(x => x.Id == id);
            if (targetProduct == null)
            {
                return "No product with id: " + id;
            }
            _dbContext.Products.Remove(targetProduct);
            _dbContext.SaveChanges();
            return "Deleted!";
        }
    }

}
