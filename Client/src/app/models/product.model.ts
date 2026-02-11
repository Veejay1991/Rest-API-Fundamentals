// Product interfaces
export interface Product {
  id: number;
  name: string;
  description: string;
  manufacturer: string;
  size: string;
  price: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  manufacturer: string;
  size: string;
  price: number;
}

export interface UpdateProductDto {
  name: string;
  description: string;
  manufacturer: string;
  size: string;
  price: number;
}

// PATCH - Partial update (only specified fields)
export interface PatchProductDto {
  name?: string;
  description?: string;
  manufacturer?: string;
  size?: string;
  price?: number;
}
