using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using wms_api.Database;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            var dbContext = ContextCreator.dbContext;
            if (dbContext == null)
            {
                return new List<User>();
            }
            return dbContext.Users;
        }

        [HttpPost]
        public User? Post(string firstName, string lastName)
        {
            var dbContext = ContextCreator.dbContext;
            if (dbContext == null)
            {
                return null;
            }
            var login = firstName.Substring(0, 3) + lastName.Substring(0, 3) + Random.Shared.Next(999);
            //TODO - generate password, then MD5 or smth
            var password = login + "123";
            var user = new User() { Login = login, Password = password };
            dbContext.Users.Add(user);
            dbContext.SaveChanges();
            return user;
        }



    }
}
