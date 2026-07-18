using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace WebApiSigin.Models.DTOs
{
    public class ProductoDTO
    {
        [Required(ErrorMessage = "El nombre del producto es obligatorio")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$", ErrorMessage = "El nombre del producto solo puede contener letras, números y espacios")]
        [StringLength(100, ErrorMessage = "El nombre del producto no puede superar los 100 caracteres")]
        public string? Nombre { get; set; }

        [Required(ErrorMessage = "La marca del producto es obligatoria")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$", ErrorMessage = "La marca del producto solo puede contener letras, números y espacios")]
        [StringLength(50, ErrorMessage = "La marca del producto no puede superar los 50 caracteres")]
        public string? Marca { get; set; }

        [Required(ErrorMessage = "El precio del producto es obligatorio")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio del producto debe ser mayor a 0")]
        public decimal Precio { get; set; }
    }
}
