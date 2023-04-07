using DenatisApp.Extentions;
using DenatisApp.Models;
using DenatisApp.Models.ViewModels;
using LoggerService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DenatisApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private DenatisDbContext _dbContext;
        private ILoggerManager _logger;
        private IConfiguration _config;

        public AuthenticationController(DenatisDbContext dbContext, ILoggerManager logger, IConfiguration config)
        {
            _dbContext = dbContext;
            _logger = logger;
            _config = config;
        }

        /// <summary>
        /// Handle Login Requests
        /// </summary>
        /// <param name="creds">username, password</param>
        /// <returns>Connected user with his Token</returns>
        [HttpPost("Login")]
        public IActionResult Login(AuthenticationCreds creds)
        {
            IActionResult response;

            User? currentUser = Authenticate(creds);

            if (currentUser != null)
            {
                var tokenString = GenerateJWT(currentUser);
                response = Ok(new { token = tokenString, currentUser });
            }
            else response = Unauthorized("Username or Password incorrect !!!");

            return response;
        }

        /// <summary>
        /// Authenticate User
        /// </summary>
        /// <param name="creds">Creds (username & password)</param>
        /// <returns>Authenticated User</returns>
        private User? Authenticate(AuthenticationCreds creds)
        {
            try
            {
                string s = StringExtentions.GenerateMD5Hash(creds.password);
                var signedUser = _dbContext.Users.Where(user =>
                    user.Username == creds.username
                    && user.Password == StringExtentions.GenerateMD5Hash(creds.password)
                ).Select(u => new User
                {
                    IdUser = u.IdUser,
                    Username = u.Username,
                    Password = "********"
                }).FirstOrDefault();

                return signedUser;
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

        /// <summary>
        /// Genrate Jason Web Token (JWT)
        /// </summary>
        /// <param name="user"></param>
        /// <returns>Token</returns>
        private string GenerateJWT(User user)
        {
            try
            {
                // Get the security key from appsetting.json
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

                // SigningCredential Représente la clé cryptographique
                // et les algorithmes de sécurité utilisés pour générer une signature numérique.
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                // claims sont utilisées pour accéder aux ressources
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Username)
                };

                // generation de JWT token
                var token = new JwtSecurityToken(
                        issuer: _config["Jwt:Issuer"],
                        audience: _config["Jwt:Audience"],
                        claims,
                        expires: DateTime.Now.AddMonths(1),
                        signingCredentials: credentials
                    );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                
                return tokenString;
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }

        }
    }
}
