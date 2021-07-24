using System;
using System.ComponentModel.DataAnnotations;
using Forum.Data.Models.Users;

namespace Forum.Data.Models
{
    public class PaginationDataForJob
    {
        public string Sort { get; set; }
        public string SortDirection { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string Filter { get; set; }
    }

    public class Job : BaseModel<int>
    {
        [MaxLength(100)]
        [Required]
        public string JobNumber { get; set; }
        public string Description { get; set; }
    }

    public class JobOutput : Job
    {
        public DateTime? CuttingStart { get; set; }
        public DateTime? CuttingEnd { get; set; }

        public DateTime? SandingStart { get; set; }
        public DateTime? SandingEnd { get; set; }

        public DateTime? BaseCoatingStart { get; set; }
        public DateTime? BaseCoatingEnd { get; set; }

        public DateTime? TopCoatingStart { get; set; }
        public DateTime? TopCoatingEnd { get; set; }

        public DateTime? PackingStart { get; set; }
        public DateTime? PackingEnd { get; set; }

        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
    }

    public class JobUserAction
    {
        public int jobId { get; set; }
        public string jobNumber { get; set; }

        public string userId { get; set; }
        public string userName { get; set; }

        public string Action { get; set; }

        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
    }
}
