using Microsoft.AspNetCore.Mvc;
using StockManagement.DTOs;
using StockManagement.Services;

namespace StockManagement.Controllers;

/// <summary>
/// REST API Controller for managing products
/// Demonstrates: GET (all/single), POST, PUT, DELETE
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;
    
    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }
    
    /// <summary>
    /// GET api/products
    /// Retrieves all products
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<ProductDto>), StatusCodes.Status200OK)]
    public ActionResult<List<ProductDto>> GetAll()
    {
        _logger.LogInformation("GET request received for all products");
        var products = _productService.GetAll();
        return Ok(products);
    }
    
    /// <summary>
    /// GET api/products/{id}
    /// Retrieves a specific product by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<ProductDto> GetById(int id)
    {
        _logger.LogInformation("GET request received for product ID: {Id}", id);
        var product = _productService.GetById(id);
        
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }
        
        return Ok(product);
    }
    
    /// <summary>
    /// POST api/products
    /// Creates a new product
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<ProductDto> Create([FromBody] CreateProductDto dto)
    {
        _logger.LogInformation("POST request received to create product: {Name}", dto.Name);
        
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        try
        {
            var product = _productService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    /// <summary>
    /// PUT api/products/{id}
    /// Updates an existing product (full update - all fields required)
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<ProductDto> Update(int id, [FromBody] UpdateProductDto dto)
    {
        _logger.LogInformation("PUT request received to update product ID: {Id}", id);
        
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        try
        {
            var product = _productService.Update(id, dto);
            
            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }
            
            return Ok(product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    /// <summary>
    /// PATCH api/products/{id}
    /// Partially updates a product (only specified fields)
    /// </summary>
    [HttpPatch("{id:int}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<ProductDto> Patch(int id, [FromBody] PatchProductDto dto)
    {
        _logger.LogInformation("PATCH request received to partially update product ID: {Id}", id);
        
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var product = _productService.Patch(id, dto);
        
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }
        
        return Ok(product);
    }
    
    /// <summary>
    /// DELETE api/products/{id}
    /// Deletes a product
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Delete(int id)
    {
        _logger.LogInformation("DELETE request received for product ID: {Id}", id);
        
        var result = _productService.Delete(id);
        
        if (!result)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }
        
        return NoContent();
    }
}
