using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using wms_api.Database;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly AppDbContext _dbContext;

        public UserController(ILogger<UserController> logger)
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
        public ObjectResult Post(string firstName, string lastName)
        {
            var login = firstName.Substring(0, 3) + lastName.Substring(0, 3) + Random.Shared.Next(999);
            //TODO - generate password, then MD5 or smth
            var password = login + "123";
            var user = new User() { Login = login, Password = password };
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, user);
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            return _dbContext.Users;
        }

        [HttpPut]
        public ObjectResult Put(User user)
        {
            var targetUser = _dbContext.Users.FirstOrDefault(x => x.Id == user.Id);
            if (targetUser == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No user with id: " + user.Id);
            }
            targetUser.Login = user.Login;
            targetUser.Password = user.Password;
            _dbContext.Users.Update(targetUser);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "Updated!");
        }

        [HttpDelete]
        public ObjectResult Delete(int id)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == id);
            if (user == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "No user with id: " + id);
            }
            _dbContext.Users.Remove(user);
            _dbContext.SaveChanges();
            return StatusCode((int)HttpStatusCode.OK, "User " + id + " deleted!");
        }

    }
}
