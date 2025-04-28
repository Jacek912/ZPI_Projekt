using Microsoft.AspNetCore.Mvc;
using System.Net;
using wms_api.Database;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductCategoryController : ControllerBase
    {
        private readonly ILogger<ProductCategoryController> _logger;
        private readonly AppDbContext _dbContext;

        public ProductCategoryController(ILogger<ProductCategoryController> logger)
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
        public ObjectResult Post(ProductCategory productCategory)
        {
            var newProductCategory = new ProductCategory
            {
                Name = productCategory.Name,
                Description = productCategory.Description,
                MinPrice = productCategory.MinPrice,
                MaxPrice = productCategory.MaxPrice,
                Weight = productCategory.Weight,
                MaxSize = productCategory.MaxSize,
            };
            _dbContext.ProductCategories.Add(newProductCategory);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, newProductCategory);
        }

        [HttpGet]
        public IEnumerable<ProductCategory> Get()
        {
            return _dbContext.ProductCategories;
        }

        [HttpPut]
        public ObjectResult Put(ProductCategory productCategory)
        {
            var targetProductCategory = _dbContext.ProductCategories.FirstOrDefault(x => x.Id == productCategory.Id);
            if (targetProductCategory == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No product category with id: " + productCategory.Id);
            }
            targetProductCategory.Name = productCategory.Name;
            targetProductCategory.Description = productCategory.Description;
            targetProductCategory.MinPrice = productCategory.MinPrice;
            targetProductCategory.MaxPrice = productCategory.MaxPrice;
            targetProductCategory.Weight = productCategory.Weight;
            targetProductCategory.MaxSize = productCategory.MaxSize;
            _dbContext.ProductCategories.Update(targetProductCategory);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "Updated!");
        }

        [HttpDelete]
        public ObjectResult Delete(int id)
        {
            var productCategory = _dbContext.ProductCategories.FirstOrDefault(x => x.Id == id);
            if (productCategory == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No product category with id: " + id);
            }
            _dbContext.ProductCategories.Remove(productCategory);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "Deleted!");
        }

    }
}
