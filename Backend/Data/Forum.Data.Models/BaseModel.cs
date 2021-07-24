using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Forum.Data.Models
{
    public class BaseEntity
    {

        public DateTime? DateModified { get; set; }
    }
    public class BaseModel<T>: BaseEntity
    {
        [Key]
        public T Id { get; set; }

    }
}
