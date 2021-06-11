using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using signalRDemo.DTO;
using signalRDemo.Helpers.Utilities;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SignalRDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }
        [HttpPost("create")]
        public async Task<ActionResult<OperationResult>> Create([FromBody] UserDTO userDTO)
        {
            var user = new IdentityUser { UserName = userDTO.account, Email = userDTO.email };
            var result = await _userManager.CreateAsync(user, userDTO.password);
            if (result.Succeeded)
            {
                return new OperationResult { Caption = "Success", Message = "Register User Success", Success = true };
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] UserDTO userDTO)
        {
            var res = await _signInManager.PasswordSignInAsync(userDTO.account, userDTO.password, isPersistent: false, lockoutOnFailure: false);

            if (res.Succeeded)
            {
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userDTO.account.ToString()),
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8
                    .GetBytes(_configuration.GetSection("jwt").Value));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = creds
                };

                var tokenHandler = new JwtSecurityTokenHandler();

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return Ok(new
                {
                    token = tokenHandler.WriteToken(token),
                    user = userDTO.account
                });
            }
            else
            {
                return BadRequest("Incorrect Login");
            }

        }
    }
}
