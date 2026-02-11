# Product Management Client

Angular client application for Product Management REST API Demo.

## Prerequisites

- Node.js 18+ 
- npm

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open browser at `http://localhost:4200`

## Make sure the API server is running

Before using the client, start the .NET API server:
```bash
cd ../Server/StockManagement
dotnet run
```

The API will be available at `https://localhost:7236`

## REST API Demonstrations

This client demonstrates the following REST API concepts:

### HTTP Methods
- **GET** - Retrieve all products or single product by ID
- **POST** - Create new product (requires all fields)
- **PUT** - Full update of product (requires all fields)
- **PATCH** - Partial update of product (only changed fields)
- **DELETE** - Remove product

### Response Codes
- 200 OK - Successful GET, PUT, PATCH
- 201 Created - Successful POST
- 204 No Content - Successful DELETE
- 400 Bad Request - Validation errors
- 404 Not Found - Resource not found

## Features

1. **Products Table** - View all products with ID, Name, and Price
2. **View Modal** - See full product details including manufacturer and size
3. **Add/Edit Modal** - Create or update products
4. **Patch Modal** - Partial update with field selection checkboxes
5. **API Details Panel** - Toggle to view request URL, headers, body, and response
