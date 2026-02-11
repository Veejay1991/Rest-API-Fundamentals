# Product Management API

.NET Core REST API for Product Management - Intern Training Demo

## Prerequisites

- .NET 8.0 SDK

## Running the API

```bash
cd Server/StockManagement
dotnet run
```

The API will be available at:
- **Swagger UI**: https://localhost:7236/swagger
- **HTTP**: http://localhost:5209

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/{id} | Get product by ID |
| POST | /api/products | Create new product |
| PUT | /api/products/{id} | Update product (full update) |
| PATCH | /api/products/{id} | Update product (partial update) |
| DELETE | /api/products/{id} | Delete product |

## Product Model

```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "manufacturer": "Manufacturer name",
  "size": "Size/dimensions",
  "price": 99.99,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## HTTP Methods Explained

- **GET**: Retrieve resources (no request body)
- **POST**: Create new resource (requires full request body)
- **PUT**: Full update (requires all fields)
- **PATCH**: Partial update (only changed fields)
- **DELETE**: Remove resource (no request body)

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Successful request |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |

## REST API Concepts Demonstrated

1. **Resource-based URLs** - /api/products
2. **HTTP Methods** - GET, POST, PUT, PATCH, DELETE
3. **HTTP Status Codes** - Proper status codes for each operation
4. **Request/Response Bodies** - JSON data transfer
5. **PUT vs PATCH** - Full vs partial updates
6. **Location Header** - Return location of created resource
