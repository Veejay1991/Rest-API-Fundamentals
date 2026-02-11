using StockManagement.DTOs;
using StockManagement.Models;

namespace StockManagement.Services;

/// <summary>
/// Service for managing products
/// </summary>
public interface IProductService
{
    List<ProductDto> GetAll();
    ProductDto? GetById(int id);
    ProductDto Create(CreateProductDto dto);
    ProductDto? Update(int id, UpdateProductDto dto);
    ProductDto? Patch(int id, PatchProductDto dto);
    bool Delete(int id);
}

public class ProductService : IProductService
{
    private readonly InMemoryDataStore _dataStore;
    
    public ProductService(InMemoryDataStore dataStore)
    {
        _dataStore = dataStore;
    }
    
    public List<ProductDto> GetAll()
    {
        return _dataStore.Products
            .Select(p => MapToDto(p))
            .ToList();
    }
    
    public ProductDto? GetById(int id)
    {
        var product = _dataStore.Products.FirstOrDefault(p => p.Id == id);
        return product != null ? MapToDto(product) : null;
    }
    
    public ProductDto Create(CreateProductDto dto)
    {
        var product = new Product
        {
            Id = _dataStore.GetNextProductId(),
            Name = dto.Name,
            Description = dto.Description,
            Manufacturer = dto.Manufacturer,
            Size = dto.Size,
            Price = dto.Price,
            CreatedAt = DateTime.UtcNow
        };
        
        _dataStore.Products.Add(product);
        
        return MapToDto(product);
    }
    
    public ProductDto? Update(int id, UpdateProductDto dto)
    {
        var product = _dataStore.Products.FirstOrDefault(p => p.Id == id);
        if (product == null) return null;
        
        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Manufacturer = dto.Manufacturer;
        product.Size = dto.Size;
        product.Price = dto.Price;
        product.UpdatedAt = DateTime.UtcNow;
        
        return MapToDto(product);
    }
    
    public ProductDto? Patch(int id, PatchProductDto dto)
    {
        var product = _dataStore.Products.FirstOrDefault(p => p.Id == id);
        if (product == null) return null;
        
        // Only update fields that are provided
        if (dto.Name != null) product.Name = dto.Name;
        if (dto.Description != null) product.Description = dto.Description;
        if (dto.Manufacturer != null) product.Manufacturer = dto.Manufacturer;
        if (dto.Size != null) product.Size = dto.Size;
        if (dto.Price.HasValue) product.Price = dto.Price.Value;
        
        product.UpdatedAt = DateTime.UtcNow;
        
        return MapToDto(product);
    }
    
    public bool Delete(int id)
    {
        var product = _dataStore.Products.FirstOrDefault(p => p.Id == id);
        if (product == null) return false;
        
        _dataStore.Products.Remove(product);
        return true;
    }
    
    private ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Manufacturer = product.Manufacturer,
            Size = product.Size,
            Price = product.Price,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}
