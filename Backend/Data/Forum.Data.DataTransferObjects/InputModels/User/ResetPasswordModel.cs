using System.ComponentModel.DataAnnotations;

namespace Forum.Data.DataTransferObjects.InputModels.User
{
    public class GenerateTempPasswordRequestModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class GenerateTempPasswordResponseModel
    {
        public string TempPassword { get; set; }
    }

    public class ResetPasswordRequestModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string ReturnUrl { get; set; }
    }

    public class ResetPasswordModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
        [Required]
        public string Token { get; set; }
    }

    public class ConfirmEmailRequest
    {
        [Required]
        [EmailAddress]
        public string CurrentEmail { get; set; }

        [Required]
        [EmailAddress]
        public string NewEmail { get; set; }

        [Required]
        public string ReturnUrl { get; set; }
    }

    public class ConfirmEmailComplete
    {
        [Required]
        public string Token { get; set; }
    }

    public class ConfirmRegisterComplete
    {
        [Required]
        public string Token { get; set; }
        public string EmailAddress { get; set; }
    }
}
