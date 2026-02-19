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
  template: `
    <div class="page-header">
      <div>
        <h1>Products</h1>
        <p class="text-muted">Manage products - Demonstrates GET, POST, PUT, PATCH, DELETE</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-toggle" [class.active]="showApiPanel" (click)="toggleApiPanel()" title="Toggle API Details Panel">
          <span class="material-icons">{{ showApiPanel ? 'code_off' : 'code' }}</span>
          {{ showApiPanel ? 'Hide API Details' : 'Show API Details' }}
        </button>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span class="material-icons">add</span>
          Add Product
        </button>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="main-layout" [class.single-column]="!showApiPanel">
      <!-- Left Column - Products -->
      <div class="left-column">
        <!-- Loading State -->
        <div *ngif="loading" class="loading-overlay">
          <div class="spinner"></div>
        </div>

        <!-- Error State -->
        <div *ngif="error" class="alert alert-danger">
          <span class="material-icons">error</span>
          {{ error }}
          <button class="btn btn-sm btn-danger" (click)="loadProducts()">Retry</button>
        </div>

        <!-- Success Message -->
        <div *ngif="successMessage" class="alert alert-success">
          <span class="material-icons">check_circle</span>
          {{ successMessage }}
        </div>

        <!-- Products Table -->
        <div class="card">
          <div class="card-header">
            <span>{{ products.length }} Products</span>
          </div>
          <div class="card-body" style="padding: 0;">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of products">
                  <td><code>{{ product.id }}</code></td>
                  <td><strong>{{ product.name }}</strong></td>
                  <td>\${{ product.price | number:'1.2-2' }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-icon btn-get" title="View Details (GET)" (click)="viewProduct(product)">
                        <span class="material-icons">visibility</span>
                      </button>
                      <button class="btn btn-icon btn-put" title="Full Edit (PUT)" (click)="openEditModal(product)">
                        <span class="material-icons">edit</span>
                      </button>
                      <button class="btn btn-icon btn-patch" title="Partial Edit (PATCH)" (click)="openPatchModal(product)">
                        <span class="material-icons">tune</span>
                      </button>
                      <button class="btn btn-icon btn-delete" title="Delete (DELETE)" (click)="deleteProduct(product)">
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngif="products.length === 0 && !loading">
                  <td colspan="4" class="text-center text-muted" style="padding: 2rem;">
                    No products found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column - API Request Details -->
      <div class="right-column" *ngif="showApiPanel">
        <div class="api-info-panel sticky">
          <div class="api-info-header">
            <h4>
              <span class="material-icons">code</span>
              API Request/Response
            </h4>
            <button *ngif="apiRequestInfo" class="btn btn-icon" (click)="clearApiInfo()" title="Clear">
              <span class="material-icons">refresh</span>
            </button>
          </div>
          <div class="api-info-content" *ngif="apiRequestInfo">
            <div class="api-section">
              <div class="api-label">Method & URL</div>
              <div class="api-value">
                <span class="method-badge" [ngClass]="apiRequestInfo.method.toLowerCase()">{{ apiRequestInfo.method }}</span>
                <code>{{ apiRequestInfo.url }}</code>
              </div>
            </div>
            <div class="api-section">
              <div class="api-label">Headers</div>
              <pre class="api-code">{{ apiRequestInfo.headers | json }}</pre>
            </div>
            <div class="api-section" *ngif="apiRequestInfo.body">
              <div class="api-label">Request Body</div>
              <pre class="api-code">{{ apiRequestInfo.body | json }}</pre>
            </div>
            <div class="api-section">
              <div class="api-label">Response (Status: {{ apiRequestInfo.statusCode }})</div>
              <pre class="api-code response">{{ apiRequestInfo.response | json }}</pre>
            </div>
          </div>
          <div class="api-info-empty" *ngif="!apiRequestInfo">
            <span class="material-icons">touch_app</span>
            <p>Perform an action to see API request/response details</p>
            <div class="action-hints">
              <div><span class="method-badge get">GET</span> Click eye icon to view product</div>
              <div><span class="method-badge post">POST</span> Click Add Product button</div>
              <div><span class="method-badge put">PUT</span> Click edit icon</div>
              <div><span class="method-badge patch">PATCH</span> Click tune icon</div>
              <div><span class="method-badge delete">DELETE</span> Click trash icon</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Product Modal (GET by ID) -->
    <div *ngif="showViewModal" class="modal-backdrop" (click)="closeViewModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Product Details (GET /api/products/{{ viewingProduct?.id }})</h3>
          <button class="btn btn-icon" (click)="closeViewModal()">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <label>ID:</label>
            <span>{{ viewingProduct?.id }}</span>
          </div>
          <div class="detail-row">
            <label>Name:</label>
            <span>{{ viewingProduct?.name }}</span>
          </div>
          <div class="detail-row">
            <label>Manufacturer:</label>
            <span>{{ viewingProduct?.manufacturer || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <label>Size:</label>
            <span>{{ viewingProduct?.size || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <label>Price:</label>
            <span>\${{ viewingProduct?.price | number:'1.2-2' }}</span>
          </div>
          <div class="detail-row">
            <label>Description:</label>
            <span>{{ viewingProduct?.description || 'N/A' }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeViewModal()">Close</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal (POST/PUT) -->
    <div *ngif="showModal" class="modal-backdrop" (click)="closeModal()">
      <div class="modal" style="max-width: 500px;" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Edit Product (PUT)' : 'Create Product (POST)' }}</h3>
          <button class="btn btn-icon" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="method-info" *ngif="editingProduct">
            <span class="method-badge put">PUT</span> 
            requires all fields to be provided (full update)
          </p>
          <p class="method-info" *ngif="!editingProduct">
            <span class="method-badge post">POST</span> 
            creates a new resource with provided data
          </p>
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.name" placeholder="Product name">
          </div>
          <div class="form-group">
            <label class="form-label">Manufacturer</label>
            <input type="text" class="form-control" [(ngModel)]="formData.manufacturer" placeholder="Manufacturer name">
          </div>
          <div class="form-group">
            <label class="form-label">Size</label>
            <input type="text" class="form-control" [(ngModel)]="formData.size" placeholder="Product size">
          </div>
          <div class="form-group">
            <label class="form-label">Price *</label>
            <input type="number" class="form-control" [(ngModel)]="formData.price" placeholder="0.00" step="0.01" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-control" [(ngModel)]="formData.description" placeholder="Product description"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
          <button class="btn btn-primary" (click)="saveProduct()" [disabled]="!isFormValid()">
            {{ editingProduct ? 'Update (PUT)' : 'Create (POST)' }}
          </button>
        </div>
      </div>
    </div>

    <!-- PATCH Modal -->
    <div *ngif="showPatchModal" class="modal-backdrop" (click)="closePatchModal()">
      <div class="modal" style="max-width: 500px;" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Partial Update (PATCH /api/products/{{ patchingProduct?.id }})</h3>
          <button class="btn btn-icon" (click)="closePatchModal()">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="method-info">
            <span class="method-badge patch">PATCH</span> 
            only updates the fields you check below (partial update)
          </p>
          <div class="patch-field">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="patchFields.name">
              Update Name
            </label>
            <input type="text" class="form-control" [(ngModel)]="patchData.name" 
                   [disabled]="!patchFields.name" placeholder="New product name">
          </div>
          <div class="patch-field">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="patchFields.manufacturer">
              Update Manufacturer
            </label>
            <input type="text" class="form-control" [(ngModel)]="patchData.manufacturer" 
                   [disabled]="!patchFields.manufacturer" placeholder="New manufacturer">
          </div>
          <div class="patch-field">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="patchFields.size">
              Update Size
            </label>
            <input type="text" class="form-control" [(ngModel)]="patchData.size" 
                   [disabled]="!patchFields.size" placeholder="New size">
          </div>
          <div class="patch-field">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="patchFields.price">
              Update Price
            </label>
            <input type="number" class="form-control" [(ngModel)]="patchData.price" 
                   [disabled]="!patchFields.price" placeholder="0.00" step="0.01" min="0">
          </div>
          <div class="patch-field">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="patchFields.description">
              Update Description
            </label>
            <textarea class="form-control" [(ngModel)]="patchData.description" 
                      [disabled]="!patchFields.description" placeholder="New description"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closePatchModal()">Cancel</button>
          <button class="btn btn-primary" (click)="applyPatch()" [disabled]="!isPatchValid()">
            Apply Patch
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      
      h1 {
        margin-bottom: 0.25rem;
      }
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .btn-toggle {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      background: var(--gray-100);
      border: 1px solid var(--gray-300);
      border-radius: 6px;
      color: var(--gray-600);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--gray-200);
        color: var(--gray-800);
      }

      &.active {
        background: #1e293b;
        border-color: #1e293b;
        color: white;
      }

      .material-icons {
        font-size: 1.125rem;
      }
    }

    /* Two Column Layout */
    .main-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 1.5rem;
    }

    .main-layout.single-column {
      grid-template-columns: 1fr;
    }

    .left-column {
      min-width: 0;
    }

    .right-column {
      min-width: 0;
    }

    .sticky {
      position: sticky;
      top: 1rem;
    }

    code {
      background: var(--gray-100);
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.8125rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .btn-get { color: #2196F3; }
    .btn-put { color: #FF9800; }
    .btn-patch { color: #9C27B0; }
    .btn-delete { color: #F44336; }

    .detail-row {
      display: flex;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--gray-100);
      
      label {
        font-weight: 600;
        width: 120px;
        color: var(--gray-600);
      }
      
      span {
        flex: 1;
      }
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    /* API Info Panel Styles */
    .api-info-panel {
      background: #1e293b;
      border-radius: 8px;
      overflow: hidden;
    }

    .api-info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #0f172a;
      color: white;

      h4 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      .btn-icon {
        color: white;
      }
    }

    .api-info-content {
      padding: 1rem;
    }

    .api-section {
      margin-bottom: 1rem;
    }

    .api-section:last-child {
      margin-bottom: 0;
    }

    .api-label {
      color: #94a3b8;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 0.375rem;
    }

    .api-value {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;

      code {
        background: #334155;
        color: #e2e8f0;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'Fira Code', monospace;
        font-size: 0.875rem;
      }
    }

    .api-code {
      background: #334155;
      color: #e2e8f0;
      padding: 0.75rem;
      border-radius: 4px;
      font-family: 'Fira Code', monospace;
      font-size: 0.8rem;
      margin: 0;
      overflow-x: auto;
      max-height: 150px;
      overflow-y: auto;
    }

    .api-code.response {
      background: #064e3b;
      color: #6ee7b7;
    }

    .method-badge {
      display: inline-flex;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .method-badge.get { background: #2196F3; color: white; }
    .method-badge.post { background: #4CAF50; color: white; }
    .method-badge.put { background: #FF9800; color: white; }
    .method-badge.patch { background: #9C27B0; color: white; }
    .method-badge.delete { background: #F44336; color: white; }

    /* Method info in modals */
    .method-info {
      background: var(--gray-50);
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: var(--gray-600);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* PATCH Modal */
    .patch-field {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: var(--gray-50);
      border-radius: 6px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-weight: 500;
      cursor: pointer;

      input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
      }
    }

    .patch-field .form-control:disabled {
      opacity: 0.5;
    }

    /* API Info Empty State */
    .api-info-empty {
      padding: 2rem 1rem;
      text-align: center;
      color: #94a3b8;

      .material-icons {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      p {
        margin: 0 0 1.5rem 0;
        font-size: 0.875rem;
      }
    }

    .action-hints {
      text-align: left;
      font-size: 0.75rem;
      
      > div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0;
        border-bottom: 1px solid #334155;
      }

      > div:last-child {
        border-bottom: none;
      }
    }

    @media (max-width: 1024px) {
      .main-layout {
        grid-template-columns: 1fr;
      }

      .right-column {
        order: -1;
      }

      .sticky {
        position: static;
      }
    }
  `]
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
