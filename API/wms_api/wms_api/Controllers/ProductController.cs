using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Logging;
using System.Net;
using wms_api.Database;
using wms_api.Model;

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
        public ObjectResult Post(Product product)
        {
            var newProduct = new Product
            {
                Name = product.Name,
                Description = product.Description,
                Amount = product.Amount,
                Category = product.Category,
                BarCode = product.BarCode,
                MinAmount = product.MinAmount,
                MaxAmount = product.MaxAmount
            };
            if (newProduct.Amount < newProduct.MinAmount || 
                newProduct.Amount > newProduct.MaxAmount)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Amount must be between min and max!");
            }
            _dbContext.Products.Add(newProduct);
            _dbContext.SaveChanges();
            SaveOperationLog("ProductController_POST", newProduct.GetPack(), newProduct.Id, -1);
            return StatusCode((int)HttpStatusCode.OK, newProduct);
        }

        [HttpGet]
        [Route("GetAll/")]
        public IEnumerable<Product> GetAll()
        {
            return _dbContext.Products;
        }

        [HttpGet]
        [Route("GetById/")]
        public IEnumerable<Product> GetById(int id)
        {
            return _dbContext.Products.Where(product => product.Id == id);
        }

        [HttpGet]
        [Route("GetByName/")]
        public IEnumerable<Product> GetByName(string name)
        {
            return _dbContext.Products.Where(product => product.Name == name);
        }

        [HttpGet]
        [Route("GetByBarCode/")]
        public IEnumerable<Product> GetByBarCode(int barCode)
        {
            return _dbContext.Products.Where(product => product.BarCode == barCode);
        }

        [HttpGet]
        [Route("GetStorageLocationsByProductId/")]
        public IEnumerable<StorageLocation> GetStorageLocationsByProductId(int productId)
        {
            List<StorageLocationProduct> storageLocations = _dbContext.StorageLocationProducts
                .Where(x => x.ProductId == productId)
                .ToList();
            List<StorageLocation> targetStorageLocations = new List<StorageLocation> ();
            foreach (StorageLocationProduct storageLocationProduct in storageLocations)
            {
                StorageLocation? storageLocation = _dbContext.StorageLocations
                    .FirstOrDefault(x => x.Id == storageLocationProduct.StorageLocationId);
                if (storageLocation != null)
                {
                    targetStorageLocations.Add(storageLocation);
                }
            }
            return targetStorageLocations;
        }

        [HttpPut]
        public ObjectResult Put(Product product)
        {
            var targetProduct = _dbContext.Products.FirstOrDefault(x => x.Id == product.Id);
            if (targetProduct == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No product with id: " + product.Id);
            }
            int amountDiff = Math.Abs((int)(targetProduct.Amount - product.Amount));
            targetProduct.Name = product.Name;
            targetProduct.Description = product.Description;
            targetProduct.Amount = product.Amount;
            targetProduct.Category = product.Category;
            targetProduct.BarCode = product.BarCode;
            targetProduct.MinAmount = product.MinAmount;
            targetProduct.MaxAmount = product.MaxAmount;
            if (targetProduct.Amount < targetProduct.MinAmount ||
               targetProduct.Amount > targetProduct.MaxAmount)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Amount must be between min and max!");
            }
            _dbContext.Update(targetProduct);
            _dbContext.SaveChanges();
            SaveOperationLog("ProductController_PUT", targetProduct.GetPack(), targetProduct.Id, amountDiff);
            return StatusCode((int)HttpStatusCode.OK, "Updated!");
        }

        [HttpDelete]
        public ObjectResult Delete(int id)
        {
            var targetProduct = _dbContext.Products.FirstOrDefault(x => x.Id == id);
            if (targetProduct == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No product with id: " + id);
            }
            _dbContext.Products.Remove(targetProduct);
            _dbContext.SaveChanges();
            SaveOperationLog("ProductController_DELETE", targetProduct.GetPack(), targetProduct.Id, -1);
            return StatusCode((int)HttpStatusCode.OK, "Deleted!");
        }

        private void SaveOperationLog(string name, string description, int productId, int amount)
        {
            OperationLog log = new OperationLog();
            log.Name = name;
            log.Description = description;
            log.ProductId = productId;
            log.Amount = amount;
            _dbContext.OperationLogs.Add(log);
            _dbContext.SaveChanges();
        }
    }

}
