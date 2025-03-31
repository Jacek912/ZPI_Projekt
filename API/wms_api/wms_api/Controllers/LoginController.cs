using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using wms_api.Database;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {

        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public string Login(string username, string password)
        {
            var dbContext = ContextCreator.dbContext;
            if (dbContext == null)
            {
                return "Error!";
            }
            User? targetUser = null;
            foreach (var user in dbContext.Users)
            {
                if (user.Login == username)
                {
                    targetUser = user;
                    break;
                }
            }
            if (targetUser == null)
            {
                return "Error!";
            }
            bool matchingPass = targetUser.Password == password;
            return matchingPass ? "Ok" : "Error!";
        }
    }
}
