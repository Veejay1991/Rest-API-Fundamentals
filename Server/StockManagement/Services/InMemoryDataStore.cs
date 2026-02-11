using StockManagement.Models;

namespace StockManagement.Services;

/// <summary>
/// In-memory data store for demonstration purposes
/// In a real application, this would be replaced with a database context
/// </summary>
public class InMemoryDataStore
{
    private static int _productIdCounter = 0;
    
    public List<Product> Products { get; } = new();
    
    public InMemoryDataStore()
    {
        SeedData();
    }
    
    private void SeedData()
    {
        // Seed Products
        var products = new[]
        {
            new Product { Id = ++_productIdCounter, Name = "Wireless Bluetooth Headphones", Description = "High-quality wireless headphones with noise cancellation", Manufacturer = "Sony", Size = "Over-ear", Price = 79.99m },
            new Product { Id = ++_productIdCounter, Name = "USB-C Charging Cable", Description = "Fast charging USB-C cable, 2 meters", Manufacturer = "Anker", Size = "2m", Price = 12.99m },
            new Product { Id = ++_productIdCounter, Name = "Portable Power Bank 10000mAh", Description = "Compact power bank with dual USB ports", Manufacturer = "Xiaomi", Size = "Compact", Price = 29.99m },
            new Product { Id = ++_productIdCounter, Name = "Men's Cotton T-Shirt", Description = "Comfortable cotton t-shirt, available in multiple colors", Manufacturer = "Nike", Size = "L", Price = 19.99m },
            new Product { Id = ++_productIdCounter, Name = "Women's Denim Jeans", Description = "Classic fit denim jeans", Manufacturer = "Levi's", Size = "M", Price = 49.99m },
            new Product { Id = ++_productIdCounter, Name = "Kids Winter Jacket", Description = "Warm winter jacket for children", Manufacturer = "Columbia", Size = "S", Price = 39.99m },
            new Product { Id = ++_productIdCounter, Name = "Non-stick Frying Pan", Description = "12-inch non-stick frying pan with glass lid", Manufacturer = "Tefal", Size = "12 inch", Price = 34.99m },
            new Product { Id = ++_productIdCounter, Name = "Electric Kettle 1.7L", Description = "Stainless steel electric kettle with auto shut-off", Manufacturer = "Philips", Size = "1.7L", Price = 24.99m },
            new Product { Id = ++_productIdCounter, Name = "Yoga Mat Premium", Description = "Non-slip yoga mat, 6mm thick", Manufacturer = "Manduka", Size = "68x24 inch", Price = 29.99m },
            new Product { Id = ++_productIdCounter, Name = "Hardcover Notebook A5", Description = "Premium hardcover notebook, ruled pages", Manufacturer = "Moleskine", Size = "A5", Price = 12.99m }
        };
        Products.AddRange(products);
    }
    
    public int GetNextProductId() => ++_productIdCounter;
}
