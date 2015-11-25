using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Web;

namespace IQualify.Web.API.Services
{
    public class EmailService : IIdentityMessageService
    {
        public async Task SendAsync(IdentityMessage message)
        {
            SendEmailAsync(message);
        }

        private void SendEmailAsync(IdentityMessage message)
        {
            #region formatter

            string text = string.Format("Please click on this link to {0}: <a href=\"{1}\">", message.Subject, message.Body);
            string html = "Please " + message.Subject + " by clicking this link: <a href=\"" + message.Body + "\">link</a><br/><br>";
            html += HttpUtility.HtmlEncode(@"Or copy the following link on the browser: " + message.Body);

            #endregion

            var emailAddress = ConfigurationManager.AppSettings["mailAccount"];
            var password = ConfigurationManager.AppSettings["mailPassword"];
            MailMessage msg = new MailMessage();
            msg.From = new MailAddress(emailAddress);
            msg.To.Add(new MailAddress(message.Destination));
            msg.Subject = message.Subject;
            msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(text, null, MediaTypeNames.Text.Plain));
            msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(html, null, MediaTypeNames.Text.Html));

            SmtpClient smtp = new SmtpClient();
            smtp.Host = "mail.xivtech.com";
            smtp.Port = 25;
            smtp.Credentials = new NetworkCredential(emailAddress, password);
            smtp.Timeout = 20000;
            System.Net.NetworkCredential credentials = new System.Net.NetworkCredential(emailAddress, password);
            smtp.Credentials = credentials;
            //smtp.EnableSsl = true;
            smtp.Send(msg);
        }
    }
}