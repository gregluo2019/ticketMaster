using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Forum.Data;
using Forum.Data.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Net.Http;
using System.Web;
using System.IO;
using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.StaticFiles;
using Forum.Data.Models.Users;
using Forum.Data.DataTransferObjects.InputModels;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Forum.Data.DataTransferObjects.ViewModels.User;

namespace Forum.WebApi.Controllers
{
    public class FileParameter
    {
        public string isSchool { get; set; }
        public string userEmail { get; set; }        
    }
    public class Result
    {
       // public ChineseTest[] Data { get; set; }
        public int Count { get; set; }
    }
    public class PaginationData
    {
        public string Sort { get; set; }
        public string SortDirection { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }        
        public int? Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Filter { get; set; }

    }
    public class Quiz
    {
        public int? Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
    }

    public class TestScores2
    {
        public string testScores { get; set; }

    }

    public class UserAndTTNumbers2
    {
        public string userId { get; set; }
        public string selectedTTNumbers { get; set; }
    }

    [AllowAnonymous]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FileController : BaseController
    {
        public class DeleteFilePath
        {
            public string filePath { get; set; }
            public string isSchoolFile { get; set; }            
        }
        public class QuizClasses
        {
            public int quizId { get; set; }
            public string classes { get; set; }
        }
        public class UserIdClass
        {
            public string userId { get; set; }
            public string className { get; set; }
        }

        private readonly ForumContext _context;
        protected UserManager<User> UserManager { get; set; }

        public FileController(ForumContext context, ILogger<BaseController> logger, IMapper mapper, UserManager<User> userManager) : base(logger, mapper)
        {
            _context = context;
            this.UserManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> FileList([FromQuery] FileParameter data)
        {
            if (this.User.FindFirst(ClaimTypes.Email) == null)
            {
                return this.Unauthorized(new { Message = "Unauthorized" });
            }
            var email = this.User.FindFirst(ClaimTypes.Email).Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                return this.Unauthorized(new { Message = "Unauthorized" });
            }

            var list = new List<string>();
            var folderName = "wwwroot\\assets\\resources\\";
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName, data.isSchool == "true"?user.UserName:data.userEmail);
            bool exists = Directory.Exists(pathToSave);
            if (!exists)
                Directory.CreateDirectory(pathToSave);

            foreach (string file in Directory.EnumerateFiles(pathToSave, "*", SearchOption.AllDirectories))
            {
                var fileFolder = file.Replace(pathToSave, "");
                list.Add(fileFolder.Substring(1));
            }
            return list.ToArray();
        }

        [Authorize]
        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        { // https://code-maze.com/upload-files-dot-net-core-angular/
            //https://gist.github.com/JaimeStill/21a8bb06242e4a418e047ae20d1de674
            try
            {
                if (this.User.FindFirst(ClaimTypes.Email) == null)
                {
                    return this.Unauthorized(new { Message = "Unauthorized" });
                }
                var email = this.User.FindFirst(ClaimTypes.Email).Value;
                var user = _context.Users.FirstOrDefault(u => u.Email == email);
                if (user == null)
                {
                    return this.Unauthorized(new { Message = "Unauthorized" });
                }

                var formCollection = await Request.ReadFormAsync();

                var folderName = "wwwroot\\assets\\resources";
                var pathToSave_Teacher = Path.Combine(Directory.GetCurrentDirectory(), folderName, user.UserName);     
                var pathToSave_User = Path.Combine(Directory.GetCurrentDirectory(), folderName, user.Email);              

                var savedFiles = new List<string>();
                foreach (var file in formCollection.Files)
                {
                    if (file.Length > 0)
                    {
                        var fileName = file.Name;
                        var questionId = file.FileName;// ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        var pathToSave = "";

                        if (questionId!=fileName && questionId != "blob")
                        {
                            pathToSave = Path.Combine(pathToSave_User, questionId);
                        }
                        else
                        {
                            pathToSave = pathToSave_Teacher;
                        }
                        var fileType = file.ContentType.Split("/")[0];
                        pathToSave = Path.Combine(pathToSave, fileType);
                        bool exists = Directory.Exists(pathToSave);
                        if (!exists)
                            Directory.CreateDirectory(pathToSave);

                        var fullPath = Path.Combine(pathToSave, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                            savedFiles.Add(fileType + "\\" + fileName);
                        }
                    }
                }
                return Ok(savedFiles.ToArray());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }


        [Authorize]
        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> DeleteFile(DeleteFilePath data)
        {
            try
            {
                if (this.User.FindFirst(ClaimTypes.Email) == null)
                {
                    return this.Unauthorized(new { Message = "Unauthorized" });
                }
                var email = this.User.FindFirst(ClaimTypes.Email).Value;
                var user = _context.Users.FirstOrDefault(u => u.Email == email);
                if (user == null)
                {
                    return this.Unauthorized(new { Message = "Unauthorized" });
                }


                var folderName = "wwwroot\\assets\\resources";
                var pathToSave_Teacher = Path.Combine(Directory.GetCurrentDirectory(), folderName, user.UserName);
                var pathToSave_User = Path.Combine(Directory.GetCurrentDirectory(), folderName, user.Email);

                var pathToDelete = "";
                if (data.isSchoolFile == "true")
                {
                    pathToDelete = Path.Combine(pathToSave_Teacher, data.filePath);
                    if (System.IO.File.Exists(pathToDelete))
                    {
                        System.IO.File.Delete(pathToDelete);
                        return Ok();
                    }
                    else
                    {
                        return Ok("File not found");
                    }
                }
                else
                {
                    pathToDelete = Path.Combine(pathToSave_User, data.filePath);
                    if (System.IO.File.Exists(pathToDelete))
                    {
                        System.IO.File.Delete(pathToDelete);
                        return Ok();
                    }
                    else
                    {
                        return Ok("File not found");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

    }

    public class StudentsResult
    {
        public UserOutputModel[] Data { get; set; }
        public int Count { get; set; }
    }
}
