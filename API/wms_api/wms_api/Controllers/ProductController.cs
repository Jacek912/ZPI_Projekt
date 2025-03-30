using Microsoft.AspNetCore.Mvc;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ILogger<ProductController> _logger;

        public ProductController(ILogger<ProductController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetProduct")]
        public Product Get()
        {
            return new Product
            {
                Id = 1,
                Name = "TestProduct",
                Description = "TestDesc",
                Amount = 10,
                Category = 1
            };
        }

        //TODO - db actions
        //[HttpPost]
        //[HttpDelete]


        //TODO - get by id/category etc
        //[HttpGet("{id}")]

    }
}
