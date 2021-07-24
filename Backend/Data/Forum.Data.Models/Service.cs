using System;
using System.ComponentModel.DataAnnotations;
using Forum.Data.Models.Users;

namespace Forum.Data.Models
{

    public class Service : BaseModel<int>
    {
        [MaxLength(100)]
        [Required]
        public string Description { get; set; }

        [Required]
        public float ChargeRate { get; set; }

        public int? Order { get; set; }

    }
}
