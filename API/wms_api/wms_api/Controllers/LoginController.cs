using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
            if (!matchingPass)
            {
                return "Error!";
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

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
