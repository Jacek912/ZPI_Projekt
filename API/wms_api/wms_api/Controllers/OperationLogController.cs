using Microsoft.AspNetCore.Mvc;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OperationLogController : ControllerBase
    {
        private readonly ILogger<OperationLogController> _logger;

        public OperationLogController(ILogger<OperationLogController> logger)
        {
            _logger = logger;
        }

        //TODO - get from db
        [HttpGet(Name = "GetOperationLog")]
        public OperationLog Get()
        {
            return new OperationLog
            {
                Id = 1,
                Name = "Add product 30 03 2025 18:09",
                Description = "Test",
                ProductId = 1,
                OperationCategory = "Add",
                Amount = 10
            };
        }
    }
}
