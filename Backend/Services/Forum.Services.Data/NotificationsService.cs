using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Amazon;
using System;
using System.Collections.Generic;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Forum.Services.Data.Interfaces;
using Forum.Data.Models;
using Forum.Data.DataTransferObjects;
using Microsoft.Extensions.Logging;
using MimeKit;
using MailKit.Net.Smtp;

namespace Forum.Services.Data
{
    public class NotificationsService : BaseService, INotificationsService
    {
        public NotificationsService(
            ILogger<BaseService> logger) : base(null, logger, null)
        {
        }
        public async Task<VpResponse> SendEmailAsync(SendTemplateEmailModel sendEmailModel)
        {

            // The email body for recipients with non-HTML email clients.
            string textBody = "Please click to reset your password\r\n" + sendEmailModel.link_url;

            // The HTML body of the email.
            string htmlBody = @"<html>
<head></head>
<body>
  <h1>Please click to reset your password</h1>   
  <a href='" + sendEmailModel.link_url + @"'>  Click this to reset password</a>.
</body>
</html>";

            var message = new MimeMessage();
            var bodyBuilder = new BodyBuilder();

            // from
            message.From.Add(new MailboxAddress("VitraGroup", "550285995@qq.com"));
            // to
            message.To.Add(new MailboxAddress("You", sendEmailModel.EmailTo));
            // reply to
           // message.ReplyTo.Add(new MailboxAddress("reply_name", "reply_email@example.com"));

            message.Subject = sendEmailModel.header;
            bodyBuilder.HtmlBody = htmlBody;
            message.Body = bodyBuilder.ToMessageBody();     

            VpResponse response = new VpResponse();
            try
            {
                var client = new SmtpClient();

                client.Connect("smtp.qq.com", 465, true);
                client.Authenticate("550285995@qq.com", "akoervokshzcbdad");
                client.Send(message);
                client.Disconnect(true);

                var logInfo = "The email was sent";
                this.Logger.LogInformation(logInfo);
                response.Successful("Message sent");
            }
            catch (Exception ex)
            {
                Console.WriteLine("The email was not sent. Error message: " + ex.Message);
                var logInfo = "The email was not sent. Error message: " + ex.Message;
                this.Logger.LogInformation(logInfo);
                response.Failed("Message failed to send");
            }

            return response;          
        }

    }
}
