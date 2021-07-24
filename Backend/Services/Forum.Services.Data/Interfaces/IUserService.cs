using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Forum.Data.DataTransferObjects.ViewModels.User;

namespace Forum.Services.Data.Interfaces
{
    public interface IUserService
    {
        Task<UserOutputModel> ToggleTeacher(string id);

        Task<UserOutputModel> ToggleBanUser(string id);


        Task<ICollection<UserOutputModel>> GetUsers();
    }
}
