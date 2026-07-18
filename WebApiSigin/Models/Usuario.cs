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
    public bool IsVerified { get; set; } = false;
    public string? VerificationToken { get; set; }

    public int IdRol { get; set; }

    public virtual Rol RolNavigation { get; set; } = null!;

}
