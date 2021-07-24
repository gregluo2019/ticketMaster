using System;
using System.ComponentModel.DataAnnotations;

namespace Forum.Data.Models
{
    public class EventLog : BaseModel<int>
    {
        public int EventId { get; set; }

        [MaxLength(100)]
        public string LogLevel { get; set; }

        [MaxLength(1000)]
        public string Message { get; set; }

        public DateTime CreatedTime { get; set; }
    }
}
