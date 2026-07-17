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
        public async Task<IActionResult> Lista()
        {
            var lista = await _dbTodoListContext.Productos.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, new {value = lista});
        }
    }
}
