# Product Management - REST API Training Demo

A simple application demonstrating REST API fundamentals using .NET 8 Web API and Angular 18 client.

## Quick Start

### 1. Start the API Server

```powershell
cd Server/StockManagement
dotnet run
```

The API will be available at:
- **Swagger UI**: https://localhost:7236/swagger
- **API Base URL**: https://localhost:7236/api

### 2. Start the Angular Client

```powershell
cd Client
npm install
npm start
```

The client will be available at: **http://localhost:4200**

---

## REST API Concepts Demonstrated

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Retrieve resources | `GET /api/products` |
| **GET** | Retrieve single resource | `GET /api/products/1` |
| **POST** | Create new resource | `POST /api/products` |
| **PUT** | Full update (all fields required) | `PUT /api/products/1` |
| **PATCH** | Partial update (only specified fields) | `PATCH /api/products/1` |
| **DELETE** | Remove resource | `DELETE /api/products/1` |

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200 OK` | Successful GET, PUT, PATCH |
| `201 Created` | Successful POST |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Invalid input/validation error |
| `404 Not Found` | Resource doesn't exist |

### PUT vs PATCH

- **PUT** - Requires all fields, replaces entire resource
- **PATCH** - Only send fields you want to change

---

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/{id}` | Update product (full) |
| PATCH | `/api/products/{id}` | Update product (partial) |
| DELETE | `/api/products/{id}` | Delete product |

### Request/Response Examples

**Create Product (POST)**
```json
{
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "manufacturer": "Sony",
  "size": "Over-ear",
  "price": 79.99
}
```

**Partial Update (PATCH)**
```json
{
  "price": 69.99
}
```

---

## Application Structure

### Server (ASP.NET Core 8 Web API)

```
Server/StockManagement/
├── Controllers/
│   └── ProductsController.cs   # API endpoints (GET, POST, PUT, PATCH, DELETE)
├── Models/
│   └── Product.cs              # Product entity
├── DTOs/
│   └── ProductDTOs.cs          # Create, Update, Patch, Response DTOs
├── Services/
│   ├── InMemoryDataStore.cs    # In-memory data storage
│   └── ProductService.cs       # Business logic
└── Program.cs                  # App configuration
```

### Client (Angular 18)

```
Client/src/app/
├── models/
│   └── product.model.ts        # TypeScript interfaces
├── services/
│   └── product.service.ts      # HTTP service for API calls
└── pages/
    └── products/
        └── products.component.ts   # Products CRUD UI
```

---

## Features

### Client UI
- View all products in a table (ID, Name, Price)
- Click **View** (eye icon) to see full product details via GET
- Click **Edit** (pencil icon) to update all fields via PUT
- Click **Tune** icon to partially update via PATCH
- Click **Delete** (trash icon) to remove via DELETE
- Click **Add Product** to create via POST
- Toggle **Show API Details** to see request/response info (URL, Headers, Body, Response)

### Sample Data
The API comes pre-loaded with 10 sample products including:
- Electronics (Headphones, Power Bank, etc.)
- Clothing (T-Shirt, Jeans, Jacket)
- Home items (Frying Pan, Electric Kettle)
- And more...

---

## Troubleshooting

### CORS Error
Make sure you're running the API before the client. The API is configured to allow requests from `http://localhost:4200`.

### Certificate Error
If you get HTTPS certificate warnings:
```powershell
dotnet dev-certs https --trust
```

### Port Already in Use
If port 7236 is in use, update the port in:
1. `Server/StockManagement/Properties/launchSettings.json`
2. `Client/src/app/services/product.service.ts`
