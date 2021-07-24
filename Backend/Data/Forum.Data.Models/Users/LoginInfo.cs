﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Forum.Data.Models.Users
{
    public class LoginInfo : BaseModel<int>
    {
        [MaxLength(50)]
        public string Ip { get; set; }

        [MaxLength(300)]
        public string ApiKey { get; set; }

        [MaxLength(300)]
        public string Location { get; set; }

        public DateTime LoginDate { get; set; }

        [Required]
        public string UserId { get; set; }

        public User User { get; set; }
    }
}
