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
    [Authorize]
    [ApiController]
    public class TodoItemController : ControllerBase
    {
        private readonly DbTodoListContext _dbTodoListContext;
        public TodoItemController(DbTodoListContext dbTodoListContext)
        {
            _dbTodoListContext = dbTodoListContext;
        }

        [HttpGet]
        [Route("Items")]
        [Authorize(Roles = "Admin,Empleado")]
        public async Task<IActionResult> TodoItems()
        {
            var todoItem = await _dbTodoListContext.TodoItems.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, new { value = todoItem });
        }
    }
}
