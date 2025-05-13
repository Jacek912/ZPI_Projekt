using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using wms_api.Database;
using wms_api.Model;

namespace wms_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {

        private readonly ILogger<LoginController> _logger;
        private readonly AppDbContext _dbContext;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
            var dbContext = ContextCreator.dbContext;
            if (dbContext == null)
            {
                throw new Exception("Null dbcontext!");
            }
            _dbContext = dbContext;
        }

        [HttpGet]
        public ObjectResult Login(string username, string password)
        {
            var dbContext = ContextCreator.dbContext;
            if (dbContext == null)
            {
                HttpStatusCode statusCode = HttpStatusCode.InternalServerError;
                var response = new HttpResponseMessage(statusCode);
                return StatusCode((int)HttpStatusCode.InternalServerError, "db error!");
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
                return StatusCode((int)HttpStatusCode.InternalServerError, "Wrong login or password!");
            }
            bool matchingPass = targetUser.Password == Encrypt(password);
            if (!matchingPass)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Wrong login or password!");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("yw5DIAuCQpH7ny4NwT3ALK3uH0e9d82Plm4LVsnT83WTmsNqfj1ON0M/T6WHuXAQ"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, targetUser.Id.ToString()),
                new Claim("login", targetUser.Login == null ? "unknown" : targetUser.Login),
            };

            var token = new JwtSecurityToken(
                issuer: "wms_test",
                audience: "wms_test",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );
            SaveOperationLog("LoginController_LOGIN", targetUser.GetPack());
            return StatusCode((int)HttpStatusCode.OK, new JwtSecurityTokenHandler().WriteToken(token));
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
