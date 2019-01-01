using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using melee_notes.Models;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Logging;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace melee_notes.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MeleeNotesContext _context;
        private readonly IConfiguration _configuration;
        private const int SALT_LENGTH = 16;
        private const int HASH_LENGTH = 20;
        private const int SALT_HASH_LENGTH = HASH_LENGTH + SALT_LENGTH;

        public UserController(MeleeNotesContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(long id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Check Username length
            if (user.Username.Trim().Length == 0)
                return BadRequest(new { responseMessage = "Username must not be empty" });

            // Check Email length
            if (user.Email.Trim().Length == 0)
                return BadRequest(new { responseMessage = "Email must not be empty" });

            // Check if Email exists
            bool hasEmail = await _context.Users.AnyAsync(u => u.Email == user.Email);
            if (hasEmail)
                return BadRequest(new { responseMessage = "Email already exists" });

            // Check if Username exists
            bool hasUsername = await _context.Users.AnyAsync(u => u.Username == user.Username);
            if (hasUsername)
                return BadRequest(new { responseMessage = "Username already exists" });

            // Check email validity
            try
            {
                MailAddress emailAddress = new MailAddress(user.Email);
                if (emailAddress.Address != user.Email)                 
                    return BadRequest(new { responseMessage = "Email is invalid" });
            }
            catch
            {
                return BadRequest(new { responseMessage = "Email is invalid" });
            }

            string password = user.Password;

            // Check password length
            const int MIN_PASSWORD_LENGTH = 8;
            if (user.Password.Length < MIN_PASSWORD_LENGTH)
                return BadRequest(new { responseMessage = "Password must be at least " + MIN_PASSWORD_LENGTH + " characters long" });

            // Check if password has a number
            string numberRegex = @"[0-9]";
            if (!Regex.IsMatch(password, numberRegex))
                return BadRequest(new { responseMessage = "Password must contain a number" });

            // Check if password has a lowercase letter
            string lowercaseLetterRegex = @"[a-z]";
            if (!Regex.IsMatch(password, lowercaseLetterRegex))
                return BadRequest(new { responseMessage = "Password must contain a lowercase letter" });

            // Check if password has a uppercase letter
            string uppercaseLetterRegex = @"[A-Z]";
            if (!Regex.IsMatch(password, uppercaseLetterRegex))
                return BadRequest(new { responseMessage = "Password must contain a uppercase letter" });

            // Check if password has a symbol
            string symbolRegex = @"[?!@#$%^&*]";
            if (!Regex.IsMatch(password, symbolRegex))
                return BadRequest(new { responseMessage = "Password must contain a symbol (?!@#$%^&*)" });

            // Salt and hash password
            byte[] salt = CreateSalt();
            byte[] hash = CreateHash(password, salt);
            user.Password = CreateHashedPasswordString(hash, salt);          

            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // GET: api/User/CheckUsername/someone
        [HttpGet("CheckUsername/{username}")]
        public async Task<ActionResult<User>> CheckUsername(string username)
        {
            bool hasUsername = await _context.Users.AnyAsync(u => u.Username == username);
            if (hasUsername)
            {
                return BadRequest();
            }

            return Ok();
        }

        // GET: api/User/CheckEmail/someone@gmail.com
        [HttpGet("CheckEmail/{email}")]
        public async Task<ActionResult<User>> CheckEmail(string email)
        {
            bool hasEmail = await _context.Users.AnyAsync(u => u.Email == email);
            if (hasEmail)
            {
                return BadRequest();
            }

            return Ok();
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return user;
        }

        // POST: api/User/Login
        [HttpPost("Login")]
        public IActionResult Login(User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid client request");
            }

            string usernameOrEmail = user.Username; // Username can hold username or email on the client side.

            User userFromDatabase = _context.Users
                .Where(u => u.Username == usernameOrEmail || u.Email == usernameOrEmail)
                .FirstOrDefault();

            if (userFromDatabase == null)
            {
                return StatusCode(404);
            }

            byte[] hashBytesDatabase = Convert.FromBase64String(userFromDatabase.Password);

            byte[] salt = new byte[SALT_LENGTH];
            Array.Copy(hashBytesDatabase, 0, salt, 0, SALT_LENGTH);

            byte[] hashBytesInput = CreateHash(user.Password, salt);
            byte[] hashAndSaltFromInput = JoinHashAndSalt(hashBytesInput, salt);

           bool isValidHash = IsValidHash(hashBytesDatabase, hashAndSaltFromInput);

            if (isValidHash)
            {
                SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecurityKey"]));
                SigningCredentials signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                List<Claim> claims = new List<Claim>
                {
                    new Claim("userId", userFromDatabase.Id.ToString()),
                    new Claim("username", userFromDatabase.Username),
                    new Claim("email", userFromDatabase.Email),
                    new Claim("dateCreated", userFromDatabase.DateCreated.ToString())
                };

                JwtSecurityToken token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Issuer"],
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(120),
                    signingCredentials: signingCredentials
                );

                string tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new { Token = tokenString });
            }
            else
            {
                return Unauthorized();
            }
        }

        private bool UserExists(long id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private bool IsValidHash(byte[] firstHash, byte[] secondHash)
        {
            bool isValidHash = true;

            for (int i = SALT_LENGTH; i < SALT_HASH_LENGTH; i++)
                if (firstHash[i] != secondHash[i])
                {
                    isValidHash = false;
                    break;
                }

            return isValidHash;
        }

        private byte[] CreateHash(string password, byte[] salt)
        {
            const int NUM_OF_ITERATIONS = 10000;

            Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(password, salt, NUM_OF_ITERATIONS);
            byte[] hash = pbkdf2.GetBytes(HASH_LENGTH);

            return hash;
        }

        private byte[] CreateSalt()
        {
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            return salt;
        }

        private string CreateHashedPasswordString(byte[] hash, byte[] salt)
        {
            byte[] hashBytes = JoinHashAndSalt(hash, salt);

            return Convert.ToBase64String(hashBytes);
        }

        private byte[] JoinHashAndSalt(byte[] hash, byte[] salt)
        {
            byte[] hashBytes = new byte[SALT_HASH_LENGTH];

            Array.Copy(salt, 0, hashBytes, 0, SALT_LENGTH);
            Array.Copy(hash, 0, hashBytes, SALT_LENGTH, HASH_LENGTH);

            return hashBytes;
        }
    }
}
