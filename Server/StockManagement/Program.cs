using StockManagement.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Register application services
builder.Services.AddSingleton<InMemoryDataStore>(); // Singleton to persist data during app lifetime
builder.Services.AddScoped<IProductService, ProductService>();

// Configure CORS for Angular client (running on localhost:4200)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure Swagger/OpenAPI with enhanced documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Product Management API",
        Version = "v1",
        Description = "REST API for Department Store Product Management - Intern Training Demo",
        Contact = new OpenApiContact
        {
            Name = "Training Team"
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Product Management API v1");
        options.DocumentTitle = "Product Management API - Swagger";
    });
}

// Enable CORS - must be before other middleware
app.UseCors("AllowAngularClient");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

Console.WriteLine("===========================================");
Console.WriteLine("  Stock Management API - REST API Demo");
Console.WriteLine("  Swagger UI: https://localhost:5001/swagger");
Console.WriteLine("===========================================");

app.Run();
