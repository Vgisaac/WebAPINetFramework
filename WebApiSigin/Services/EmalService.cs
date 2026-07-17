using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace WebApiSigin.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task EnviarCorreoVerificacion(string correo, string token)
        {
            var frontendUrl = $"http://localhost:5173/confirmar/email?token={token}";

            var smtpClient = new SmtpClient(_config["MailSettings:Host"], int.Parse(_config["MailSettings:Port"]!))
            {
                Credentials = new NetworkCredential(
                    _config["MailSettings:Username"]!,
                    _config["MailSettings:Password"]!
                ),
                EnableSsl = bool.Parse(_config["MailSettings:EnableSsl"]!),
            };

            var mensaje = new MailMessage();
            mensaje.From = new MailAddress(_config["MailSettings:From"]!, "Verificación WebApiSign");
            mensaje.To.Add(correo);
            mensaje.Subject = "Verifica tu cuenta";

            mensaje.Body = $@"
        <h2>¡Bienvenido!</h2>
        <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
        <a href='{frontendUrl}'>Verificar mi cuenta</a>
    ";

            mensaje.IsBodyHtml = true;

            await smtpClient.SendMailAsync(mensaje);
        }


    }
}
