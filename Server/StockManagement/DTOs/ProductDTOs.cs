using System.ComponentModel.DataAnnotations;

namespace StockManagement.DTOs;

/// <summary>
/// DTO for creating a new product
/// </summary>
public class CreateProductDto
{
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 200 characters")]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string Description { get; set; } = string.Empty;
    
    [StringLength(200, ErrorMessage = "Manufacturer cannot exceed 200 characters")]
    public string Manufacturer { get; set; } = string.Empty;
    
    [StringLength(50, ErrorMessage = "Size cannot exceed 50 characters")]
    public string Size { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Price is required")]
    [Range(0, double.MaxValue, ErrorMessage = "Price cannot be negative")]
    public decimal Price { get; set; }
}

/// <summary>
/// DTO for updating a product (full update - PUT)
/// </summary>
public class UpdateProductDto
{
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 200 characters")]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string Description { get; set; } = string.Empty;
    
    [StringLength(200, ErrorMessage = "Manufacturer cannot exceed 200 characters")]
    public string Manufacturer { get; set; } = string.Empty;
    
    [StringLength(50, ErrorMessage = "Size cannot exceed 50 characters")]
    public string Size { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Price is required")]
    [Range(0, double.MaxValue, ErrorMessage = "Price cannot be negative")]
    public decimal Price { get; set; }
}

/// <summary>
/// DTO for partial update (PATCH) - all properties are optional
/// </summary>
public class PatchProductDto
{
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 200 characters")]
    public string? Name { get; set; }
    
    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string? Description { get; set; }
    
    [StringLength(200, ErrorMessage = "Manufacturer cannot exceed 200 characters")]
    public string? Manufacturer { get; set; }
    
    [StringLength(50, ErrorMessage = "Size cannot exceed 50 characters")]
    public string? Size { get; set; }
    
    [Range(0, double.MaxValue, ErrorMessage = "Price cannot be negative")]
    public decimal? Price { get; set; }
}

/// <summary>
/// DTO for product response
/// </summary>
public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
