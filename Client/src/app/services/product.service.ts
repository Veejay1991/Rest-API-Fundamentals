import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, CreateProductDto, UpdateProductDto, PatchProductDto } from '../models';

/**
 * Service for Product CRUD operations
 * Demonstrates: GET, POST, PUT, DELETE HTTP methods
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'https://localhost:7236/api/products';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/products
   * Retrieves all products
   */
  getAll(): Observable<Product[]> {
    console.log('📡 API Call: GET', this.apiUrl);
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * GET /api/products/{id}
   * Retrieves a single product by ID
   */
  getById(id: number): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📡 API Call: GET', url);
    return this.http.get<Product>(url);
  }

  /**
   * POST /api/products
   * Creates a new product
   */
  create(product: CreateProductDto): Observable<Product> {
    console.log('📡 API Call: POST', this.apiUrl, product);
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * PUT /api/products/{id}
   * Updates an existing product (full update)
   */
  update(id: number, product: UpdateProductDto): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📡 API Call: PUT', url, product);
    return this.http.put<Product>(url, product);
  }

  /**
   * PATCH /api/products/{id}
   * Partially updates a product (only specified fields)
   */
  patch(id: number, product: PatchProductDto): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📡 API Call: PATCH', url, product);
    return this.http.patch<Product>(url, product);
  }

  /**
   * DELETE /api/products/{id}
   * Deletes a product
   */
  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📡 API Call: DELETE', url);
    return this.http.delete<void>(url);
  }
}

