using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using System.Net;
using wms_api.Database;
using wms_api.Model;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StorageLocationController : ControllerBase
    {
        private readonly ILogger<StorageLocationController> _logger;
        private readonly AppDbContext _dbContext;

        public StorageLocationController(ILogger<StorageLocationController> logger) 
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
        public ObjectResult Post(string name, string description)
        {
            var newStorageLocation = new StorageLocation
            {
                Name = name,
                Description = description
            };
            _dbContext.StorageLocations.Add(newStorageLocation);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, newStorageLocation);
        }

        [HttpGet]
        [Route("GetAll/")]
        public IEnumerable<StorageLocation> GetAll()
        {
            return _dbContext.StorageLocations;
        }

        [HttpGet]
        [Route("GetById/")]
        public IEnumerable<StorageLocation> GetById(int id)
        {
            return _dbContext.StorageLocations.Where(location => location.Id == id);
        }

        [HttpGet]
        [Route("GetByName/")]
        public IEnumerable<StorageLocation> GetByName(string name)
        {
            return _dbContext.StorageLocations.Where(location => location.Name == name);
        }

        [HttpGet]
        [Route("GetAllProductsByLocationId/")]
        public IEnumerable<Product> GetAllProducts(int locationId)
        {
            var targetStorageLocation = _dbContext.StorageLocations.FirstOrDefault(x => x.Id == locationId);
            if (targetStorageLocation == null)
            {
                return Array.Empty<Product>();
            }
            List<StorageLocationProduct> storageLocationProducts = _dbContext.StorageLocationProducts
                .Where(x => x.StorageLocationId == targetStorageLocation.Id)
                .ToList();
            List<Product> targetProducts = new List<Product> ();
            foreach (StorageLocationProduct storageLocation in storageLocationProducts)
            {
                Product? product = _dbContext.Products.FirstOrDefault(x => x.Id == storageLocation.ProductId);
                if (product != null)
                {
                    targetProducts.Add(product);
                }
            }
            return targetProducts;
        }

        [HttpPut]
        [Route("UpdateLocation/")]
        public ObjectResult UpdateLocation(StorageLocation location)
        {
            var targetStorageLocation = _dbContext.StorageLocations.FirstOrDefault(x => x.Id == location.Id);
            if (targetStorageLocation == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No storage location with id: " + location.Id);
            }
            targetStorageLocation.Name = location.Name;
            targetStorageLocation.Description = location.Description;
            _dbContext.Update(targetStorageLocation);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "Updated!");
        }

        [HttpPut]
        [Route("AddProduct/")]
        public ObjectResult AddProduct(int locationId, int productId)
        {
            var targetStorageLocation = _dbContext.StorageLocations.FirstOrDefault(x => x.Id == locationId);
            if (targetStorageLocation == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No storage location with id: " + locationId);
            }
            var targetProduct = _dbContext.Products.FirstOrDefault(x => x.Id == productId);
            if (targetProduct == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No product with id: " + productId);
            }
            StorageLocationProduct storageLocationProduct = new StorageLocationProduct()
            {
                StorageLocationId = targetStorageLocation.Id,
                ProductId = targetProduct.Id
            };
            if (_dbContext.StorageLocationProducts.Contains(storageLocationProduct))
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Product already in storage!");
            }
            _dbContext.StorageLocationProducts.Add(storageLocationProduct);
            _dbContext.Update(targetStorageLocation);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "Updated!");
        }

        [HttpPut]
        [Route("RemoveProduct/")]
        public ObjectResult RemoveProduct(int locationId, int productId)
        {
            var targetStorageLocation = _dbContext.StorageLocations
                .FirstOrDefault(x => x.Id == locationId);
            if (targetStorageLocation == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No storage location with id: " + locationId);
            }
            var targetStorageLocationProduct = _dbContext.StorageLocationProducts
                .FirstOrDefault(x => x.StorageLocationId == targetStorageLocation.Id && x.ProductId == productId);
            if (targetStorageLocationProduct == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No product in storage! location_id: " + locationId + " / product_id: " + productId);
            }
            _dbContext.StorageLocationProducts.Remove(targetStorageLocationProduct);
            _dbContext.Update(targetStorageLocation);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "Updated!");
        }

        [HttpDelete]
        public ObjectResult Delete(StorageLocation location)
        {
            var targetStorageLocation = _dbContext.StorageLocations.FirstOrDefault(x => x.Id == location.Id);
            if (targetStorageLocation == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No storage location with id: " + location.Id);
            }
            List<StorageLocationProduct> targetStorageLocationProducts = _dbContext.StorageLocationProducts
                .Where(x => x.StorageLocationId == targetStorageLocation.Id)
                .ToList();
            _dbContext.StorageLocationProducts.RemoveRange(targetStorageLocationProducts);
            _dbContext.StorageLocations.Remove(targetStorageLocation);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "Deleted!");
        }
    }
}
