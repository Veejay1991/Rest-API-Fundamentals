import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services';
import { Product, CreateProductDto, UpdateProductDto, PatchProductDto } from '../../models';

// Interface for API request/response info display
interface ApiRequestInfo {
  method: string;
  url: string;
  headers: { [key: string]: string };
  body: any;
  response: any;
  statusCode: number;
  timestamp: Date;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  successMessage = '';

  // API Panel Toggle
  showApiPanel = false;

  // API Request Info Panel
  apiRequestInfo: ApiRequestInfo | null = null;
  private readonly apiUrl = 'https://localhost:7236/api/products';
  private readonly defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // View Modal
  showViewModal = false;
  viewingProduct: Product | null = null;

  // Create/Edit Modal
  showModal = false;
  editingProduct: Product | null = null;
  formData = this.getEmptyFormData();

  // PATCH Modal
  showPatchModal = false;
  patchingProduct: Product | null = null;
  patchData = { name: '', description: '', manufacturer: '', size: '', price: 0 };
  patchFields = { name: false, description: false, manufacturer: false, size: false, price: false };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  toggleApiPanel() {
    this.showApiPanel = !this.showApiPanel;
  }

  loadProducts(showApiInfo = true) {
    this.loading = true;
    this.error = '';

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        if (showApiInfo) {
          this.setApiInfo('GET', this.apiUrl, null, data, 200);
        }
      },
      error: (err) => {
        this.error = 'Failed to load products. Make sure the API server is running.';
        this.loading = false;
        if (showApiInfo) {
          this.setApiInfo('GET', this.apiUrl, null, err.error || err.message, err.status || 500);
        }
        console.error('API Error:', err);
      }
    });
  }

  // API Info Panel
  setApiInfo(method: string, url: string, body: any, response: any, statusCode: number) {
    this.apiRequestInfo = {
      method,
      url,
      headers: this.defaultHeaders,
      body,
      response,
      statusCode,
      timestamp: new Date()
    };
  }

  clearApiInfo() {
    this.apiRequestInfo = null;
  }

  // View Modal (GET by ID)
  viewProduct(product: Product) {
    this.loading = true;
    const url = `${this.apiUrl}/${product.id}`;
    
    this.productService.getById(product.id).subscribe({
      next: (data) => {
        this.viewingProduct = data;
        this.showViewModal = true;
        this.loading = false;
        this.setApiInfo('GET', url, null, data, 200);
      },
      error: (err) => {
        this.error = 'Failed to load product details';
        this.loading = false;
        this.setApiInfo('GET', url, null, err.error || err.message, err.status || 500);
        console.error('API Error:', err);
      }
    });
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewingProduct = null;
  }

  // Create/Edit Modal
  getEmptyFormData() {
    return {
      name: '',
      description: '',
      manufacturer: '',
      size: '',
      price: 0
    };
  }

  openCreateModal() {
    this.editingProduct = null;
    this.formData = this.getEmptyFormData();
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.editingProduct = product;
    this.formData = {
      name: product.name,
      description: product.description || '',
      manufacturer: product.manufacturer || '',
      size: product.size || '',
      price: product.price
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingProduct = null;
  }

  isFormValid(): boolean {
    return !!this.formData.name && this.formData.price >= 0;
  }

  saveProduct() {
    if (this.editingProduct) {
      // PUT - Full update
      const updateDto: UpdateProductDto = {
        name: this.formData.name,
        description: this.formData.description,
        manufacturer: this.formData.manufacturer,
        size: this.formData.size,
        price: this.formData.price
      };
      const url = `${this.apiUrl}/${this.editingProduct.id}`;
      
      this.productService.update(this.editingProduct.id, updateDto).subscribe({
        next: (response) => {
          this.showSuccess('Product updated successfully (PUT)');
          this.setApiInfo('PUT', url, updateDto, response, 200);
          this.closeModal();
          this.loadProducts(false);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update product';
          this.setApiInfo('PUT', url, updateDto, err.error || err.message, err.status || 500);
          console.error('API Error:', err);
        }
      });
    } else {
      // POST - Create
      const createDto: CreateProductDto = {
        name: this.formData.name,
        description: this.formData.description,
        manufacturer: this.formData.manufacturer,
        size: this.formData.size,
        price: this.formData.price
      };
      
      this.productService.create(createDto).subscribe({
        next: (response) => {
          this.showSuccess('Product created successfully (POST)');
          this.setApiInfo('POST', this.apiUrl, createDto, response, 201);
          this.closeModal();
          this.loadProducts(false);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create product';
          this.setApiInfo('POST', this.apiUrl, createDto, err.error || err.message, err.status || 500);
          console.error('API Error:', err);
        }
      });
    }
  }

  // PATCH Modal
  openPatchModal(product: Product) {
    this.patchingProduct = product;
    this.patchData = {
      name: product.name,
      description: product.description || '',
      manufacturer: product.manufacturer || '',
      size: product.size || '',
      price: product.price
    };
    this.patchFields = { name: false, description: false, manufacturer: false, size: false, price: false };
    this.showPatchModal = true;
  }

  closePatchModal() {
    this.showPatchModal = false;
    this.patchingProduct = null;
  }

  isPatchValid(): boolean {
    return this.patchFields.name || this.patchFields.description || this.patchFields.manufacturer || this.patchFields.size || this.patchFields.price;
  }

  applyPatch() {
    if (!this.patchingProduct) return;

    // Build patch DTO with only selected fields
    const patchDto: PatchProductDto = {};
    if (this.patchFields.name) patchDto.name = this.patchData.name;
    if (this.patchFields.description) patchDto.description = this.patchData.description;
    if (this.patchFields.manufacturer) patchDto.manufacturer = this.patchData.manufacturer;
    if (this.patchFields.size) patchDto.size = this.patchData.size;
    if (this.patchFields.price) patchDto.price = this.patchData.price;

    const url = `${this.apiUrl}/${this.patchingProduct.id}`;

    this.productService.patch(this.patchingProduct.id, patchDto).subscribe({
      next: (response) => {
        this.showSuccess('Product patched successfully (PATCH)');
        this.setApiInfo('PATCH', url, patchDto, response, 200);
        this.closePatchModal();
        this.loadProducts(false);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to patch product';
        this.setApiInfo('PATCH', url, patchDto, err.error || err.message, err.status || 500);
        console.error('API Error:', err);
      }
    });
  }

  // Delete
  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      const url = `${this.apiUrl}/${product.id}`;
      
      this.productService.delete(product.id).subscribe({
        next: () => {
          this.showSuccess('Product deleted successfully (DELETE)');
          this.setApiInfo('DELETE', url, null, { message: 'Resource deleted' }, 204);
          this.loadProducts(false);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete product';
          this.setApiInfo('DELETE', url, null, err.error || err.message, err.status || 500);
          console.error('API Error:', err);
        }
      });
    }
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }
}
