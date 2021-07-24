using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Forum.Data.Common.Interfaces;
using Forum.Data.DataTransferObjects.ViewModels.User;
using Forum.Data.Models.Users;
using Forum.Services.Data.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Forum.Services.Data
{
    public class UserService : BaseService, IUserService
    {
        private readonly IRepository<User> userRepository;

        public UserService(IRepository<User> userRepository, UserManager<User> userManager, ILogger<BaseService> logger, IMapper mapper) : base(userManager, logger, mapper)
        {
            this.userRepository = userRepository;
        }


        public async Task<UserOutputModel> ToggleTeacher(string id)
        {
            var user = this.GetUserById(id);

            if (user is null)
            {
                throw new ArgumentException($"User with id '{id}' does not exist.");
            }


            IdentityResult result = null;

            if (await this.UserManager.IsInRoleAsync(user, "Manager"))
            {
                result = await this.UserManager.RemoveFromRoleAsync(user, "Manager");
                await this.UserManager.AddToRoleAsync(user, "Normal");
            }
            else
            {
                await this.UserManager.RemoveFromRoleAsync(user, "Normal");
                result = await this.UserManager.AddToRoleAsync(user, "Manager");
            }

            if (result.Succeeded)
            {
                var isAdmin = await this.UserManager.IsInRoleAsync(user, "Admin");
                var isManager = await this.UserManager.IsInRoleAsync(user, "Manager");
                var mappedUser = this.Mapper.Map<UserOutputModel>(user);
                mappedUser.IsAdmin = isAdmin;
                mappedUser.IsManager = isManager;

                return mappedUser;
            }
            else
                return null;
        }

        public async Task<UserOutputModel> ToggleBanUser(string id)
        {
            var user = this.GetUserById(id);

            if (user is null)
            {
                throw new ArgumentException($"User with id '{id}' does not exist.");
            }

            user.IsActive = !user.IsActive;
            this.userRepository.Update(user);
            await this.userRepository.SaveChangesAsync();

            var isAdmin = await this.UserManager.IsInRoleAsync(user, "Admin");
            var isManager = await this.UserManager.IsInRoleAsync(user, "Manager");
            var mappedUser = this.Mapper.Map<UserOutputModel>(user);
            mappedUser.IsAdmin = isAdmin;
            mappedUser.IsManager = isManager;

            return mappedUser;
        }

        public async Task<ICollection<UserOutputModel>> GetUsers()
        {
            var users = this.UserManager.Users.OrderByDescending(u=>u.DateRegistered).ToList();
            var mappedUsers = new List<UserOutputModel>();

            foreach (var user in users)
            {
                var isAdmin = await this.UserManager.IsInRoleAsync(user, "Admin");
                var isManager = await this.UserManager.IsInRoleAsync(user, "Manager");
                var mappedUser = this.Mapper.Map<UserOutputModel>(user);
                mappedUser.IsAdmin = isAdmin;
                mappedUser.IsManager = isManager;
                mappedUsers.Add(mappedUser);
            }

            return mappedUsers;
        }

        private User GetUserById(string id)
        {
            return this.userRepository.Query().FirstOrDefault(u => u.Id == id);
        }
    }
}
