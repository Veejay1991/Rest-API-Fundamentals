import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { CreateProductDto, PatchProductDto, Product, UpdateProductDto } from '../models';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  const apiUrl = 'https://localhost:7236/api/products';
  const mockProduct: Product = {
    id: 1,
    name: 'Product 1',
    description: 'Desc 1',
    manufacturer: 'Manu 1',
    size: 'Small',
    price: 100,
    createdAt: new Date('2025-01-01')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve all products', () => {
    const mockProducts = [mockProduct];

    service.getAll().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const request = httpTestingController.expectOne(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush(mockProducts);
  });

  it('should retrieve a single product by id', () => {
    service.getById(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('GET');
    request.flush(mockProduct);
  });

  it('should create a product with the correct request body', () => {
    const createProductDto: CreateProductDto = {
      name: 'New Product',
      description: 'New Desc',
      manufacturer: 'New Manu',
      size: 'Medium',
      price: 200
    };

    service.create(createProductDto).subscribe(product => {
      expect(product).toEqual({ ...mockProduct, ...createProductDto, id: 2 });
    });

    const request = httpTestingController.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(createProductDto);
    request.flush({ ...mockProduct, ...createProductDto, id: 2 });
  });

  it('should update a product with the correct request body', () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Product',
      description: 'Updated Desc',
      manufacturer: 'Updated Manu',
      size: 'Large',
      price: 300
    };

    service.update(1, updateProductDto).subscribe(product => {
      expect(product).toEqual({ ...mockProduct, ...updateProductDto });
    });

    const request = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updateProductDto);
    request.flush({ ...mockProduct, ...updateProductDto });
  });

  it('should partially update a product with the correct request body', () => {
    const patchProductDto: PatchProductDto = {
      name: 'Patched Product',
      price: 150
    };

    service.patch(1, patchProductDto).subscribe(product => {
      expect(product).toEqual({ ...mockProduct, ...patchProductDto });
    });

    const request = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(patchProductDto);
    request.flush({ ...mockProduct, ...patchProductDto });
  });

  it('should delete a product', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const request = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('should propagate error responses to subscribers', () => {
    const errorResponse = { message: 'Server error' };

    service.getAll().subscribe({
      next: () => fail('expected an error response'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.error).toEqual(errorResponse);
      }
    });

    const request = httpTestingController.expectOne(apiUrl);
    request.flush(errorResponse, { status: 500, statusText: 'Server Error' });
  });
});
