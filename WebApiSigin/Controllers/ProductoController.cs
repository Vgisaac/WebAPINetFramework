using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiSigin.Custom;
using WebApiSigin.Models;
using WebApiSigin.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace WebApiSigin.Controllers
{
    [Route("api/[controller]")]
    [Authorize] //para solo un solo tipo de authetication JWT
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] //para multiples Authentications
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly DbTodoListContext _dbTodoListContext;
        public ProductoController(DbTodoListContext dbTodoListContext)
        {
            _dbTodoListContext = dbTodoListContext;
        }

        [HttpGet]
        [Route("Lista")]
        [Authorize(Roles = "Admin,Empleado")]
        public async Task<IActionResult> Lista()
        {
            var lista = await _dbTodoListContext.Productos.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, new {value = lista});
        }

        [HttpPost]
        [Route("Crear")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Crear([FromBody] ProductoDTO objeto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    isSuccess = false,
                    errores = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            var modeloProducto = new Producto
            {
                Nombre = objeto.Nombre,
                Marca = objeto.Marca,
                Precio = objeto.Precio
            };

            _dbTodoListContext.Productos.Add(modeloProducto);
            await _dbTodoListContext.SaveChangesAsync();

            if(modeloProducto.IdProducto != 0)
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = true, mensaje = "Producto creado correctamente" });
            else
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = false, mensaje = "El Producto no se pudo crear correctamente" });
        }

        [HttpPut]
        [Route("Actualizar/{idProducto:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Actualizar([FromRoute] int idProducto, [FromBody] ProductoDTO objeto)
        {
            if (idProducto <= 0)
            {
                return BadRequest(new
                {
                    isSuccess = false,
                    mensaje = "El identificador del producto no es válido"
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    isSuccess = false,
                    errores = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }

            var producto = await _dbTodoListContext.Productos
                .FirstOrDefaultAsync(p => p.IdProducto == idProducto);

            if (producto == null)
            {
                return NotFound(new
                {
                    isSuccess = false,
                    mensaje = "Producto no encontrado"
                });
            }

            producto.Nombre = objeto.Nombre;
            producto.Marca = objeto.Marca;
            producto.Precio = objeto.Precio;

            await _dbTodoListContext.SaveChangesAsync();

            return Ok(new
            {
                isSuccess = true,
                mensaje = "Producto actualizado correctamente"
            });
        }

        [HttpDelete]
        [Route("Eliminar/{idProducto:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromRoute] int idProducto)
        {
            if (idProducto <= 0)
            {
                return BadRequest(new
                {
                    isSuccess = false,
                    mensaje = "El identificador del producto no es válido"
                });
            }

            var producto = await _dbTodoListContext.Productos
                .FirstOrDefaultAsync(p => p.IdProducto == idProducto);

            if (producto == null)
            {
                return NotFound(new
                {
                    isSuccess = false,
                    mensaje = "Producto no encontrado"
                });
            }

            _dbTodoListContext.Productos.Remove(producto);
            await _dbTodoListContext.SaveChangesAsync();

            return Ok(new
            {
                isSuccess = true,
                mensaje = "Producto eliminado correctamente"
            });
        }

    }
}
