using System;
using System.Threading.Tasks;
using Forum.Data.DataTransferObjects.ViewModels.User;
using Forum.Services.Data.Interfaces;
using Forum.WebApi.Controllers;
using Forum.WebApi.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Forum.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Text;
using Forum.Data.Models;
using System.Security.Claims;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Forum.Data.Models.Users;
using AutoMapper;

namespace Forum.WebApi.Areas.Admin.Controllers
{
    public class PaginationDataForPrivate
    {
        public string Sort { get; set; }
        public string SortDirection { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string Type { get; set; }
        public string Subtype { get; set; }
        public string Child { get; set; }
        public string Filter { get; set; }
        public Boolean OnlyWrongQuestions { get; set; }
    }

    public class logs
    {
        public string logsString;
    }

    [Authorize]
    [Route("api/[controller]/[action]")]
    public class AdminController : BaseController
    {
        private readonly ForumContext _context;
        private readonly IUserService userService;
        protected UserManager<User> UserManager { get; set; }

        public AdminController(ForumContext context, IUserService userService, ILogger<BaseController> logger, IMapper mapper, UserManager<User> userManager) : base(logger, mapper)
        {
            this.userService = userService;
            _context = context;
            this.UserManager = userManager;
        }

        public class UserIdTestScores
        {
            public string userId { get; set; }
            public string testScores { get; set; }
        }


        [HttpPost("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesDefaultResponseType]
        public async Task<object> ToggleTeacher(string id)
        {
            if (this.User.IsInRole("Admin"))
            {
                try
                {
                    var user = await this.userService.ToggleTeacher(id);

                    return this.Ok(user);
                }
                catch (Exception e)
                {
                    return this.BadRequest(new ReturnMessage { Message = e.Message });
                }
            }

            return this.Unauthorized(new ReturnMessage { Message = "You are unauthorized!" });
        }

        [HttpPost("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesDefaultResponseType]
        public async Task<object> ToggleBanUser(string id)
        {
            if (this.User.IsInRole("Admin"))
            {
                try
                {
                    var user = await this.userService.ToggleBanUser(id);

                    return this.Ok(user);
                }
                catch (Exception e)
                {
                    return this.BadRequest(new ReturnMessage { Message = e.Message });
                }
            }

            return this.Unauthorized(new ReturnMessage { Message = "You are unauthorized!" });
        }




        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<object> GetLogs()
        {
            if (this.User.IsInRole("Admin"))
            {
                try
                {
                    var result = "";
                    var logFileToday = "Logs/myapp-" + DateTime.Today.ToString("yyyyMMdd") + ".txt";
                    if (System.IO.File.Exists(logFileToday))
                    {
                        using (FileStream fs = System.IO.File.Open(logFileToday, FileMode.Open, FileAccess.ReadWrite, FileShare.ReadWrite))
                        {
                            // Read the source file into a byte array.
                            byte[] bytes = new byte[fs.Length];
                            int numBytesToRead = (int)fs.Length;
                            int numBytesRead = 0;
                            while (numBytesToRead > 0)
                            {
                                // Read may return anything from 0 to numBytesToRead.
                                int n = fs.Read(bytes, numBytesRead, numBytesToRead);

                                // Break when the end of the file is reached.
                                if (n == 0)
                                    break;

                                numBytesRead += n;
                                numBytesToRead -= n;
                            }
                            result = Encoding.UTF8.GetString(bytes);
                        }                    
                    }

                    return this.Ok(new logs{ logsString= result });
                }
                catch (Exception e)
                {
                    return this.BadRequest(new ReturnMessage { Message = e.Message });
                }
            }

            return this.Unauthorized(new ReturnMessage { Message = "You are unauthorized!" });
        }
    }
}
