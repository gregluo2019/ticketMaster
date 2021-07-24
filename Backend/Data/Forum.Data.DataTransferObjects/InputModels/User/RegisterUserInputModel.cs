using System;
using System.ComponentModel.DataAnnotations;

namespace Forum.Data.DataTransferObjects.InputModels.User
{
    public class UserInputModel
    {
        private const int PasswordMinLength = 6;
        private const string PasswordMinLengthMessage = "Password must be at least 6 symbols.";

        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Invalid e-mail.")]
        public string Email { get; set; }

        [Required]
        [MinLength(PasswordMinLength, ErrorMessage = PasswordMinLengthMessage)]
        public string Password { get; set; }

        [Required]
        public string Pw { get; set; }
    }

    public class RegisterUserInputModel
    {
        private const int UsernameMinLength = 4;
        private const string MinLengthMessage = "Username must be at least 4 symbols.";

        private const int UsernameMaxLength = 20;
        private const string MaxLengthMessage = "Username must be maximum 20 symbols.";

        private const int PasswordMinLength = 6;
        private const string PasswordMinLengthMessage = "Password must be at least 6 symbols.";

        //private const string RegExWithout = "^[^@]*$";
        //private const string UsernameRegExMessage = "Username name must not have symbol \"@\" in itself.";

        [Required]
        [MinLength(UsernameMinLength, ErrorMessage = MinLengthMessage)]
        [MaxLength(UsernameMaxLength, ErrorMessage = MaxLengthMessage)]
      //  [RegularExpression(RegExWithout, ErrorMessage = UsernameRegExMessage)]
        public string Username { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Invalid e-mail.")]
        public string Email { get; set; }

        [Required]
        [MinLength(PasswordMinLength, ErrorMessage = PasswordMinLengthMessage)]
        public string Password { get; set; }

        [Required]
        public string Pw { get; set; }

        /////////////////////////
        
        public string Phone { get; set; }

        public string Address { get; set; }
        public Boolean IsActive { get; set; }

        public string Note { get; set; }

        public bool? IsManager { get; set; }
    }
}
