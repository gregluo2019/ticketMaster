using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Forum.Data.Models
{
    public class ContactUs : BaseModel<int>
    {
        [MaxLength(100)]
        public string Email { get; set; }

        [MaxLength(100)]
        public string Subject { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }
    }
}
