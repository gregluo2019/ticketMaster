using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text;
using Forum.Data.Models;
using Forum.Data.DataTransferObjects;

namespace Forum.Services.Data.Interfaces

{
    public interface INotificationsService 
    {
        Task<VpResponse> SendEmailAsync(SendTemplateEmailModel sendEmailModel);
    }
}
