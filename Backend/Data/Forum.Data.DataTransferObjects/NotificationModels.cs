using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Forum.Data.DataTransferObjects

{
    public class NotificationSettings
    {
        public EmailSettings Email { get; set; } = new EmailSettings();
        public SmsSettings Sms { get; set; } = new SmsSettings();
    }

    public class SmsSettings
    {
        public string Provider { get; set; }
        public string ApiKey { get; set; }
    }

    public class EmailSettings
    {
        public string Provider { get; set; }
        public string ApiKey { get; set; }
    }

    public class SendEmailModelBase
    {
        [Required]
        [EmailAddress]
        public string EmailFrom { get; set; }
        public string EmailFromName { get; set; }
        [Required]
        [EmailAddress]
        public string EmailTo { get; set; }
        public string EmailToName { get; set; }
        
    }


    public class SendEmailModel : SendEmailModelBase
    {
        [Required]
        public string Subject { get; set; }
        [Required]
        public string BodyHtml { get; set; }
        public string BodyPlainText { get; set; }
    }

    public class SendTemplateEmailModel : SendEmailModelBase
    {
        public string header { get; set; }
        public string link_text { get; set; }
        public string link_url { get; set; }
    }

}
