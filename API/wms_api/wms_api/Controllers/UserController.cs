using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Runtime.Intrinsics.Arm;
using System.Security.Cryptography;
using System.Text;
using wms_api.Database;
using wms_api.Model;

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
            var login = firstName.Substring(0, 3) + lastName.Substring(0, 3) + Random.Shared.Next(9999);
            var password = GenerateRandomPassword();

            var user = new User() { Login = login, Password = Encrypt(password) };
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            SaveOperationLog("UserController_POST", user.GetPack());
            var userCopy = new User()
            {
                Login = user.Login,
                Password = password
            };
            return StatusCode((int)HttpStatusCode.OK, userCopy);
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            SaveOperationLog("UserController_GET", "All");
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
            SaveOperationLog("UserController_PUT", targetUser.GetPack());
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
            SaveOperationLog("UserController_DELETE", user.GetPack());
            return StatusCode((int)HttpStatusCode.OK, "User " + id + " deleted!");
        }


        private string GenerateRandomPassword()
        {
            string[] charsTab =
            [
                "ABCDEFGHJKLMNOPQRSTUVWXYZ",
                "abcdefghijkmnopqrstuvwxyz",
                "0123456789",
                "!@$?_-"
            ];

            var rnd = new Random(); 
            List<char> targetChars = new List<char>();

            foreach (string chars in charsTab)
            {
                targetChars.Insert(rnd.Next(0, targetChars.Count), chars[rnd.Next(0, chars.Length)]);
            }

            for (int i = targetChars.Count; i < 11 || targetChars.Distinct().Count() < 6; i++)
            {
                string buff = charsTab[rnd.Next(0, charsTab.Length)];
                targetChars.Insert(rnd.Next(0, charsTab.Length), buff[rnd.Next(0, buff.Length)]);
            }

            return new string(targetChars.ToArray());
        }

        private string Encrypt(string pass)
        {
            UTF8Encoding utf8Encoding = new UTF8Encoding();
            SHA256 sha256 = SHA256.Create();
            return Convert.ToBase64String(sha256.ComputeHash(utf8Encoding.GetBytes(pass)));

        }

        private void SaveOperationLog(string name, string description)
        {
            OperationLog log = new OperationLog();
            log.Name = name;
            log.Description = description;
            _dbContext.OperationLogs.Add(log);
            _dbContext.SaveChanges();
        }

    }
}
