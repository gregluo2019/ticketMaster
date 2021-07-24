using System;
using System.ComponentModel.DataAnnotations;
using Forum.Data.Models.Users;

namespace Forum.Data.Models
{
    public class PaginationDataForJobUser
    {
        public string Sort { get; set; }
        public string SortDirection { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string Filter { get; set; }
    }

    public class JobUser : BaseModel<int>
    {
        [Required]
        public int JobId { get; set; }
        public Job Job { get; set; }

        [Required]
        public string UserId { get; set; }
        public User User { get; set; }

        [MaxLength(100)]
        public string Action { get; set; }

        public DateTime? Time { get; set; }
    }
}
