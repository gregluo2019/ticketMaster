using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Forum.Data.DataTransferObjects.InputModels.Post
{
    public class PostInputModel
    {
        private const int TitleMinLength = 6;
        private const int TitleMaxLength = 100;
        private const string PostTitleMessage = "Title must be between 6 symbols and 100 symbols";

        private const int BodyMinLength = 10;
        private const int BodyMaxLength = 500000;
        private const string PostBodyMessage = "Body must be between 10 symbols and 500000 symbols";

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(TitleMaxLength, MinimumLength = TitleMinLength, ErrorMessage = PostTitleMessage)]
        public string Title { get; set; }

        [Required]
        [StringLength(BodyMaxLength, MinimumLength = BodyMinLength, ErrorMessage = PostBodyMessage)]
        public string Body { get; set; }
    }
}
