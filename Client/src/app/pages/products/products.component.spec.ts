import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product.model';

const mockProducts: Product[] = [
  { id: 1, name: 'Product 1', description: 'Desc 1', manufacturer: 'Manu 1', size: 'Small', price: 100, createdAt: new Date('2025-01-01') },
  { id: 2, name: 'Product 2', description: 'Desc 2', manufacturer: 'Manu 2', size: 'Medium', price: 200, createdAt: new Date('2025-01-02') }
];

class MockProductService {
  getAll = jasmine.createSpy().and.returnValue(of(mockProducts));
  getById = jasmine.createSpy().and.callFake((id) => of(mockProducts.find(p => p.id === id)));
  create = jasmine.createSpy().and.returnValue(of({ ...mockProducts[0], id: 3 }));
  update = jasmine.createSpy().and.returnValue(of({ ...mockProducts[0] }));
  patch = jasmine.createSpy().and.returnValue(of({ ...mockProducts[0] }));
  delete = jasmine.createSpy().and.returnValue(of({}));
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: MockProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [{ provide: ProductService, useClass: MockProductService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productService.getAll).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
  });

  it('should handle error on loadProducts', () => {
    productService.getAll.and.returnValue(throwError({ error: 'API error', status: 500 }));
    component.loadProducts();
    expect(component.error).toContain('Failed to load products');
  });

  it('should open and close view modal', () => {
    component.viewProduct(mockProducts[0]);
    expect(component.showViewModal).toBeTrue();
    component.closeViewModal();
    expect(component.showViewModal).toBeFalse();
  });

  it('should open and close create modal', () => {
    component.openCreateModal();
    expect(component.showModal).toBeTrue();
    component.closeModal();
    expect(component.showModal).toBeFalse();
  });

  it('should open and close patch modal', () => {
    component.openPatchModal(mockProducts[0]);
    expect(component.showPatchModal).toBeTrue();
    component.closePatchModal();
    expect(component.showPatchModal).toBeFalse();
  });

  it('should validate form', () => {
    component.formData.name = 'Test';
    component.formData.price = 10;
    expect(component.isFormValid()).toBeTrue();
    component.formData.name = '';
    expect(component.isFormValid()).toBeFalse();
  });

  it('should save product (create)', () => {
    component.editingProduct = null;
    component.formData = { name: 'New', description: '', manufacturer: '', size: '', price: 10 };
    component.saveProduct();
    expect(productService.create).toHaveBeenCalled();
  });

  it('should save product (update)', () => {
    component.editingProduct = mockProducts[0];
    component.formData = { name: 'Updated', description: '', manufacturer: '', size: '', price: 20 };
    component.saveProduct();
    expect(productService.update).toHaveBeenCalled();
  });

  it('should apply patch', () => {
    component.patchingProduct = mockProducts[0];
    component.patchFields.name = true;
    component.patchData.name = 'Patched';
    component.applyPatch();
    expect(productService.patch).toHaveBeenCalled();
  });

  it('should delete product', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteProduct(mockProducts[0]);
    expect(productService.delete).toHaveBeenCalled();
  });
});
