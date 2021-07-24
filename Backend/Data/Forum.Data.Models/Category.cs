using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace Forum.Data.Models
{
    public class Category : BaseModel<int>
    {
        [MaxLength(100)]
        public string Name { get; set; }
    }
}
