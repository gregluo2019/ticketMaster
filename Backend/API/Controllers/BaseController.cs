using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Forum.Data.Models.Users;

namespace Forum.WebApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class BaseController : ControllerBase
    {
        public SignInManager<User> SignInManager { get; set; }

        public BaseController( ILogger<BaseController> logger, IMapper mapper, SignInManager<User> signInManager =null)
        {
            this.SignInManager = signInManager;

            this.Logger = logger;
            this.Mapper = mapper;
        }

        protected ILogger<BaseController> Logger { get; set; }
        protected IMapper Mapper { get; set; }

    }
}
