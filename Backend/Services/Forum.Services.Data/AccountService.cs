using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Forum.Data;
using Forum.Data.Common.Interfaces;
using Forum.Data.DataTransferObjects.Enums;
using Forum.Data.DataTransferObjects.InputModels.User;
using Forum.Data.DataTransferObjects.ViewModels.IpInformation;
using Forum.Data.DataTransferObjects.ViewModels.User;
using Forum.Data.Models.Users;
using Forum.Services.Data.Interfaces;
using Forum.Services.Data.Utils;
using Forum.WebApi.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using LoginInfo = Forum.Data.Models.Users.LoginInfo;

namespace Forum.Services.Data
{
    public class AccountService : BaseService, IAccountService
    {
        protected readonly HttpClient client;
        protected readonly GeoLocationSettings geoLocationSettings;
        protected readonly IHttpContextAccessor accessor;
        protected readonly IRepository<LoginInfo> loginInfoRepository;

        private readonly SignInManager<User> signInManager;
        private readonly IRepository<User> userRepository;
        private readonly JwtSettings jwtSettings;

        public AccountService(UserManager<User> userManager,
                            IHttpContextAccessor accessor,
                            IOptions<GeoLocationSettings> geoLocationSettings,
                            IOptions<JwtSettings> jwtSettings,
                            ILogger<BaseService> logger,
                            IMapper mapper,
                            IRepository<User> userRepository,
                            IRepository<LoginInfo> loginInfoRepository,
                            SignInManager<User> signInManager)
            : base(userManager, logger, mapper)
        {
            this.userRepository = userRepository;
            this.signInManager = signInManager;
            this.jwtSettings = jwtSettings.Value;
            this.client = new HttpClient();
            this.geoLocationSettings = geoLocationSettings.Value;
            this.loginInfoRepository = loginInfoRepository;
            this.accessor = accessor;
        }

        public async Task UpdateUserPassword(UserInputModel model)
        {
            var oldUser = this.UserManager.Users.SingleOrDefault(u => u.Email == model.Email);
            if (oldUser is null)
            {
                throw new Exception("Invalid username or password!");
            }

            if (!string.IsNullOrEmpty(model.Password) && !string.IsNullOrEmpty(model.Pw) )
            {
                if (oldUser.Pw != model.Pw) // mode.pw is old password
                {
                    throw new Exception("Invalid old password!");
                }

                var newPasswordHash = this.UserManager.PasswordHasher.HashPassword(oldUser, model.Password);
                oldUser.PasswordHash = newPasswordHash;
                oldUser.Pw = model.Password;
            }

            await this.UserManager.UpdateAsync(oldUser);
        }

        public async Task UpdateUser(RegisterUserInputModel model)
        {
            var oldUser = this.UserManager.Users.SingleOrDefault(u => u.Email == model.Email);
            if (oldUser is null)
            {
                throw new Exception("Invalid username or password!");
            }

            if (oldUser.IsActive == false)
            {
                throw new UnauthorizedAccessException("You are banned! Contact admin for further information.");
            }

            if (!string.IsNullOrEmpty(model.Password) && !string.IsNullOrEmpty(model.Pw) && model.Password != "vitragroup")
            {
                if (oldUser.Pw != model.Pw) // mode.pw is old password
                {
                    throw new Exception("Invalid old password!");
                }

                var newPasswordHash = this.UserManager.PasswordHasher.HashPassword(oldUser, model.Password);
                oldUser.PasswordHash = newPasswordHash;
                oldUser.Pw = model.Password;
            }

            oldUser.IsActive = model.IsActive;
            oldUser.Phone = model.Phone;
            oldUser.Address = model.Address;
            oldUser.Note = model.Note;

            await this.UserManager.UpdateAsync(oldUser);

            if (model.IsManager==true)
            {
                await this.UserManager.RemoveFromRoleAsync(oldUser, "Normal");
                 await this.UserManager.AddToRoleAsync(oldUser, "Manager");
             //   await this.UserManager.AddToRoleAsync(oldUser, Enum.GetName(typeof(Roles), 3));
            }
            else
            {
                await this.UserManager.RemoveFromRoleAsync(oldUser, "Manager");
                await this.UserManager.AddToRoleAsync(oldUser, "Normal");
              //  await this.UserManager.AddToRoleAsync(oldUser, Enum.GetName(typeof(Roles), 2));
            }
        }

        public async Task<User> Register(RegisterUserInputModel model)
        {
            var user = this.Mapper.Map<RegisterUserInputModel, User>(model);

            if (this.UserManager.Users.Count(u => u.UserName == user.UserName) != 0)
            {
                throw new Exception("Username is already taken!");
            }

            if (this.UserManager.Users.Count(u => u.Email == user.Email) != 0)
            {
                throw new Exception("Email is already taken!"); 
            }  
             
            user.DateRegistered = DateTime.UtcNow;

            await this.UserManager.CreateAsync(user, model.Password);

            if (model.IsManager == true)
            {
                await this.UserManager.AddToRoleAsync(user, Enum.GetName(typeof(Roles), 3));
            }
            else
            {
                await this.UserManager.AddToRoleAsync(user, Enum.GetName(typeof(Roles), 2));
            }
            return user;
        }

        public ICollection<LoginInfoViewModel> GetUserLoginInfo(string username)
        {
            var user = this.UserManager.Users.SingleOrDefault(u => u.UserName == username);

            var loginHistory = this.loginInfoRepository
                .Query()
                .Where(li => li.UserId == user.Id)
                .OrderByDescending(li => li.LoginDate).ToList();

            return this.Mapper.Map<ICollection<LoginInfoViewModel>>(loginHistory);
        }

        public async Task<string> Login(LoginUserInputModel model)
        {
            var user = this.UserManager.Users.SingleOrDefault(u => u.Email == model.Email);
            if (user is null)
            {
                throw new Exception("Invalid username or password!");
            }

            if (user.IsActive == false)
            {
                throw new UnauthorizedAccessException("You are banned! Contact admin for further information.");
            }

            var result = await this.signInManager.PasswordSignInAsync(user, model.Password, false, false);

            if (!result.Succeeded)
            {
                throw new Exception("Invalid username or password!");
            }

            return GenerateToken(user);
        }

        public async Task SeedAdmin(RegisterUserInputModel model)
        {
            var user = this.Mapper.Map<RegisterUserInputModel, User>(model);
            user.IsActive = true;
            user.DateRegistered = DateTime.UtcNow;

            try
            {
                await this.UserManager.CreateAsync(user, model.Password);

                await this.UserManager.AddToRoleAsync(user, Enum.GetName(typeof(Roles), 1));
            }
            catch (Exception e)
            {
                this.Logger.LogWarning(e, "Creation of ApplicationUser and its role resulted in failure: " + e.Message);
            }
        }

        protected string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(this.jwtSettings.Secret);
            var role = this.UserManager.GetRolesAsync(user).GetAwaiter().GetResult();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("userId", user.Id),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, role.First()),
                    new Claim("isAdmin", this.UserManager.IsInRoleAsync(user, "Admin").GetAwaiter().GetResult().ToString(), ClaimValueTypes.Boolean),
                    new Claim("isManager", this.UserManager.IsInRoleAsync(user, "Manager").GetAwaiter().GetResult().ToString(), ClaimValueTypes.Boolean),
                    new Claim("IsActive", user.IsActive.ToString(), ClaimValueTypes.Boolean),
                    new Claim("phone",string.IsNullOrEmpty(user.PhoneNumber)?"":user.Phone),
                    new Claim("address",string.IsNullOrEmpty(user.Address)?"":user.Address),
                }),

                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


    }
}
