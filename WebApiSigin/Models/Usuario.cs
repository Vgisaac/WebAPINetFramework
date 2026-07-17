using System;
using System.Collections.Generic;

namespace WebApiSigin.Models;

public partial class Usuario
{
    public int IdUsusario { get; set; }

    public string? Nombre { get; set; }
    public string? Apellido { get; set; }
    public string? Correo { get; set; }
    public string? Clave { get; set; }
    public string Rol { get; set; } = "Empleado";
    public bool IsVerified { get; set; } = false;
    public string? VerificationToken { get; set; }

}
