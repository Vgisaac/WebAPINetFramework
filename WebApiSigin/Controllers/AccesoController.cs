using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiSigin.Custom;
using WebApiSigin.Models;
using WebApiSigin.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using System.Net.Mail;
using System.Net;
using WebApiSigin.Services;

namespace WebApiSigin.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class AccesoController : ControllerBase
    {
        private readonly DbTodoListContext _dbTodoListContext;
        private readonly Utilidades _utilidades;
        private readonly EmailService _emailService;
        public AccesoController(DbTodoListContext dbTodoListContext, Utilidades utilidades, EmailService emailService)
        {
            _dbTodoListContext = dbTodoListContext;
            _utilidades = utilidades;
            _emailService = emailService;
        }

        [HttpPost]
        [Route("Registrarse")]
        public async Task<IActionResult> Registrarse([FromBody] UsuarioDTO objeto)
        {
            if (!ModelState.IsValid) 
            { 
                return BadRequest(new 
                {
                    isSuccess = false,
                    errores = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            //Validar correo, que no este duplicado
            bool existeCorreo = await _dbTodoListContext.Usuarios.AnyAsync(u => u.Correo == objeto.Correo);

            if (existeCorreo)
                return BadRequest(new { isSuccess = false, mensaje = "El correo ya está registrado" });

            // generar token único
            //var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var token = Convert.ToBase64String(tokenBytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .TrimEnd('=');

            // se llam el modelo para guardar los datos en la BD
            var modeloUsuario = new Usuario
            {
                Nombre = objeto.Nombre,
                Apellido = objeto.Apellido,
                Correo = objeto.Correo,
                Clave = _utilidades.encriptarSHA256(objeto.Clave!),
                Rol = "Empleado",
                IsVerified = false,
                VerificationToken = token
            };

            await _dbTodoListContext.Usuarios.AddAsync(modeloUsuario);
            await _dbTodoListContext.SaveChangesAsync();

            // Enviar correo con el link de verificación
            await _emailService.EnviarCorreoVerificacion(objeto.Correo!, token);

            if (modeloUsuario.IdUsusario != 0)
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = true, mensaje = "Registro exitoso. Revisa tu correo para confirmar tu cuenta." });
            else
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = false, mensaje = "El usuario no se pudo registrar correctamente" });
        }

        [HttpGet]
        [Route("ConfirmarCorreo")]
        public async Task<IActionResult> ConfirmarCorreo([FromQuery] string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return BadRequest(new
                {
                    isSuccess = false,
                    mensaje = "Token no válido"
                });
            }

            //token = token.Replace(" ", "+");
            token = token.Trim();

            // Busca el usuario con ese token de verificación
            var usuario = await _dbTodoListContext.Usuarios
                .FirstOrDefaultAsync(u => u.VerificationToken == token);

            if (usuario == null)
            {
                return NotFound(new { mensaje = "Token inválido o expirado" });
            }

            // Verificar cuenta
            usuario.IsVerified = true;
            usuario.VerificationToken = null;
            await _dbTodoListContext.SaveChangesAsync();

            return Ok(new
            {
                isSuccess = true,
                mensaje = "Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión."
            });
        }

        //[HttpGet]
        //[Route("ConfirmarCorreo")]
        //public async Task<IActionResult> ConfirmarCorreo([FromQuery] string token)
        //{
        //    // Si no trae token
        //    if (string.IsNullOrWhiteSpace(token))
        //    {
        //        return Redirect("http://localhost:5173/confirmar/email?status=error&msg=token-invalido");
        //    }

        //    token = token.Replace(" ", "+");

        //    // Buscar al usuario
        //    var usuario = await _dbTodoListContext.Usuarios
        //        .FirstOrDefaultAsync(u => u.VerificationToken == token);

        //    // Token incorrecto o expirado
        //    if (usuario == null)
        //    {
        //        return Redirect("http://localhost:5173/confirmar/email?status=error&msg=token-expirado");
        //    }

        //    // Marcar verificado
        //    usuario.IsVerified = true;
        //    usuario.VerificationToken = null;
        //    await _dbTodoListContext.SaveChangesAsync();

        //    // Redirigir al frontend
        //    return Redirect("http://localhost:5173/confirmar/email?status=success");
        //}

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginDTO objeto)
        {
            // verifica que los inputs tengan datos de entrada
            if (string.IsNullOrWhiteSpace(objeto.Correo) || string.IsNullOrWhiteSpace(objeto.Clave))
            {
                return BadRequest(new { isSuccess = false, mensaje = "Debe ingresar correo y contraseña" });
            }

            // consulta los datos en la BD
            var usuarioEncontrado = await _dbTodoListContext.Usuarios
                                       .Where(u =>
                                        u.Correo == objeto.Correo &&
                                        u.Clave == _utilidades.encriptarSHA256(objeto.Clave)
                                        ).FirstOrDefaultAsync();
            // Verificamos si el usuario existe
            if (usuarioEncontrado == null)
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = false, mensaje = "credenciales incorrectas", token = "" });
            // verifica si el corrreo esta verificado
            if (!usuarioEncontrado.IsVerified)
            {
                return Unauthorized(new
                {
                    isSuccess = false,
                    mensaje = "Debes verificar tu correo antes de iniciar sesión"
                });
            }
            // genera el token he inicia sesión
            return StatusCode(StatusCodes.Status200OK, new
            {
                isSuccess = true,
                token = _utilidades.generarJWT(usuarioEncontrado)
            });
        }

    }
}
