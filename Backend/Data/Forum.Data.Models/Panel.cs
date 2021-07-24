using System;
using System.ComponentModel.DataAnnotations;
using Forum.Data.Models.Users;

namespace Forum.Data.Models
{
    public class PaginationDataForPanel
    {
        public string Sort { get; set; }
        public string SortDirection { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string Name { get; set; }
        public string Filter { get; set; }
    }

    public class Panel : BaseModel<int>
    {
        [MaxLength(100)]
        [Required]
        public string PanelId { get; set; }

        [Required]
        public int Qty { get; set; }

        [Required]
        public int Length { get; set; }

        [Required]
        public int Width { get; set; }

        [Required]
        public int Depth { get; set; }

        public float Area { get; set; }
        public float TotalArea { get; set; }

        [Required]
        [MaxLength(200)]
        public string Color { get; set; }

        [MaxLength(100)]
        public string ColorType { get; set; }

        public DateTime PackingTime { get; set; }
        public string PackingStaffId { get; set; }
        public User PackingStaff { get; set; }

        [MaxLength(100)]
        [Required]
        public int JobId { get; set; }
        public Job Job { get; set; }

        public string Description { get; set; }
    }
}
