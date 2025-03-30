using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("{Name}")]
        public User Get(string Name)
        {
            return new User
            {
                Id = 1,
                Login = Name + Random.Shared.Next(9999),
                Password = Name + Random.Shared.Next(9999)
            };
        }

        //TODO - db actions
        //[HttpPost]

        //TODO - get by id/login?
        //[HttpGet("{id}")]

    }
}
