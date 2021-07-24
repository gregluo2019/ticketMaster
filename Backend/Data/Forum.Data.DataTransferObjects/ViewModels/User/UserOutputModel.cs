using System;
using System.Collections.Generic;
using System.Text;

namespace Forum.Data.DataTransferObjects.ViewModels.User
{
    public class UserOutputModel
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string UserName { get; set; }

        public DateTime DateRegistered { get; set; }

        public bool IsAdmin { get; set; }

        public bool IsManager { get; set; }

        public bool IsActive { get; set; }

        public string Address { get; set; }

        public string Note { get; set; }

    }
}
