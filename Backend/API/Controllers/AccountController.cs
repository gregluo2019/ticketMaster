using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Forum.Data;
using Forum.Data.DataTransferObjects.InputModels.User;
using Forum.Data.DataTransferObjects.ViewModels.User;
using Forum.Data.Models.Users;
using Forum.Services.Data.Interfaces;
using Forum.WebApi.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using Forum.Services.Data;
using Forum.Data.Models;
using Forum.Data.DataTransferObjects;

namespace Forum.WebApi.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]/[action]")]
    public class AccountController : BaseController
    {
        private readonly IAccountService accountService;
        private readonly ForumContext _context;
        protected UserManager<User> UserManager { get; set; }
        public INotificationsService notificationsService { get; set; }

        public AccountController(IAccountService accountService, ILogger<BaseController> logger, ForumContext context, IMapper mapper, 
            UserManager<User> userManager, INotificationsService notificationsService, SignInManager<User> signInManager)
            : base(logger, mapper, signInManager)
        {
            this.accountService = accountService;
            _context = context;
            this.UserManager = userManager;
            this.notificationsService = notificationsService;
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<object>> SendResetPasswordNotification(ResetPasswordRequestModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (user != null)
            {
                string token = await this.SignInManager.UserManager.GeneratePasswordResetTokenAsync(user);
                string encodedCode = System.Web.HttpUtility.UrlEncode(token);
                string paramSeparator = "?";
                if (model.ReturnUrl.Contains("?"))
                {
                    paramSeparator = "&";
                }

                SendTemplateEmailModel sendEmailModel = new SendTemplateEmailModel()
                {
                    EmailFrom = "greg.luo@outlook.com",
                    EmailTo = user.Email,
                    header = "Reset Password Request",
                    link_url = "https://toplearning.com.au"+model.ReturnUrl + paramSeparator + "token=" + encodedCode
                };
              //  await this.notificationsService.SendEmailAsync(sendEmailModel);

                // generate the email properties
                VpResponse response = await this.notificationsService.SendEmailAsync(sendEmailModel);
                if (response.Success)
                {
                    return response;
                }
                return BadRequest("Failed to send the reset password email");
            }
            else
            {
                return BadRequest("Your password could not be reset.  Please check your email is correct and if the error continues, report the problem to Voice Project.");
            }
            //return NotFound();
        }

        public async Task<List<string>> ValidatePasswordAsync(User user, string password)
        {
            PasswordValidator<User> validator = new PasswordValidator<User>();
            var passwordCheck = await validator.ValidateAsync(this.SignInManager.UserManager, user, password);
            List<string> listErrors = new List<string>();
            if (passwordCheck.Succeeded != true)
            {
                foreach (var err in passwordCheck.Errors)
                {
                    listErrors.Add(err.Description);
                }
            }

            return listErrors;
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<VpResponse>> ResetPasswordComplete(ResetPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (user != null)
            {
                // authenticate against the token
                // Check for valid password
                var validPwd = await ValidatePasswordAsync(user, model.ConfirmPassword);
                if (validPwd.Count > 0)
                {
                    return BadRequest(string.Join(" ", validPwd.ToArray()));
                }

                IdentityResult result = await this.SignInManager.UserManager.ResetPasswordAsync(user, model.Token, model.Password);
                if (result.Succeeded)
                {
                    return new VpResponse().Successful("The password has been reset");
                }
                return BadRequest(result.Errors);
            }
            else
            {
                return new VpResponse().NotFound("Your password could not be reset.  Please check your email is correct and if the error continues, report the problem to Voice Project.");
            }

            //return NotFound();
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<object> GetUsers()
        {
            if (this.User.IsInRole("Admin") || this.User.IsInRole("Manager"))
            {
                try
                {
                    var users = await _context.Users
                        .OrderBy(p => p.UserName)
                        .ToListAsync();

                    var mappedUsers = new List<UserOutputModel>();
                    foreach (var u in users)
                    {
                        var isAdmin = await this.UserManager.IsInRoleAsync(u, "Admin");
                        var isManager = await this.UserManager.IsInRoleAsync(u, "Manager");
                        var mappedUser = this.Mapper.Map<UserOutputModel>(u);
                        mappedUser.IsManager = isManager;
                        if (!isAdmin)
                        {
                            mappedUsers.Add(mappedUser);
                        }
                    }

                    return mappedUsers;
                }
                catch (Exception e)
                {
                    return this.BadRequest(new { Message = e.Message });
                }
            }

            return this.Unauthorized(new { Message = "You are unauthorized!" });
        }

        [Authorize]
        [HttpPut]
        public async Task<object> UpdateUserPassword([FromBody] UserInputModel model)
        {
            try
            {
                await this.accountService.UpdateUserPassword(model);

                return this.Ok(new ReturnMessage() { Message = "You have successfully updated!" });
            }
            catch (Exception e)
            {
                return this.BadRequest(new ReturnMessage { Message = e.Message });
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<object> UpdateUser([FromBody] RegisterUserInputModel model)
        {
            try
            {
                await this.accountService.UpdateUser(model);

                return this.Ok(new ReturnMessage() { Message = "You have successfully updated!" });
            }
            catch (Exception e)
            {
                return this.BadRequest(new ReturnMessage { Message = e.Message });
            }
        }


        [Authorize]
        [HttpDelete("{id}")]
        public async Task<object> DeleteUser(string  id)
        {
            try
            {
                if (!this.User.IsInRole("Admin") && !this.User.IsInRole("Manager"))
                {
                    return this.Unauthorized();
                }

                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception e)
            {
                return this.BadRequest(new ReturnMessage { Message = e.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<User>>  Register([FromBody] RegisterUserInputModel model)
        {
            try
            {
                var user= await this.accountService.Register(model);

                return user;
            }
            catch (Exception e)
            {
                return this.BadRequest(new ReturnMessage { Message = e.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<object> Login([FromBody] LoginUserInputModel model)
        {
            try
            {
                this.Logger.LogInformation(" ");
                this.Logger.LogInformation("==========");
                var logInfo = "Login: User: " + model.Email;
                this.Logger.LogInformation(logInfo);

                var token = await this.accountService.Login(model);
                return this.Ok(new LoginViewModel {Message = "You have successfully logged in!", Token = token});
            }
            catch (UnauthorizedAccessException e)
            {
                return this.Unauthorized(new ReturnMessage { Message = e.Message});
            }
            catch (Exception e)
            {
                return this.BadRequest(new ReturnMessage {Message = "Invalid e-mail or password!"});
            }
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<object> History()
        {
            try
            {
                var history = this.accountService.GetUserLoginInfo(this.User.FindFirst(ClaimTypes.Name).Value);
                return this.Ok(history);
            }
            catch (Exception e)
            {
                return this.BadRequest(new ReturnMessage { Message = "Something went wrong!" });
            }
        }
    }
}
