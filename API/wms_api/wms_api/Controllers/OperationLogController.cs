using Microsoft.AspNetCore.Mvc;
using System.Net;
using wms_api.Database;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OperationLogController : ControllerBase
    {
        private readonly ILogger<OperationLogController> _logger;
        private readonly AppDbContext _dbContext;

        public OperationLogController(ILogger<OperationLogController> logger)
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
        public ObjectResult Post(OperationLog operationLog)
        {
            var newOperationLog = new OperationLog
            {
                Name = operationLog.Name,
                Description = operationLog.Description,
                ProductId = operationLog.ProductId,
                OperationCategory = operationLog.OperationCategory,
                Amount = operationLog.Amount
            };
            _dbContext.OperationLogs.Add(newOperationLog);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, newOperationLog);
        }

        [HttpGet]
        public IEnumerable<OperationLog> Get()
        {
            return _dbContext.OperationLogs;
        }

        [HttpPut]
        public ObjectResult Put(OperationLog operationLog)
        {
            var targetOperationLog = _dbContext.OperationLogs.FirstOrDefault(x => x.Id == operationLog.Id);
            if (targetOperationLog == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No operation log with id: " + operationLog.Id);
            }
            targetOperationLog.Name = operationLog.Name;
            targetOperationLog.Description = operationLog.Description;
            targetOperationLog.ProductId = operationLog.ProductId;
            targetOperationLog.OperationCategory = operationLog.OperationCategory;
            targetOperationLog.Amount = operationLog.Amount;
            _dbContext.OperationLogs.Update(targetOperationLog);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "Updated!");
        }

        [HttpDelete]
        public ObjectResult Delete(int id)
        {
            var operationLog = _dbContext.OperationLogs.FirstOrDefault(x => x.Id == id);
            if (operationLog == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No operation log with id: " + id);
            }
            _dbContext.OperationLogs.Remove(operationLog);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "Deleted!");
        }
    }
}
