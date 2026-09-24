import {type Product,type ProductFormData } from '../types/product';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export const productApi = {
  // Fetch all products with optional filters
  async getAll(params?: { is_active?: boolean; search?: string }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.is_active !== undefined) {
      searchParams.append('is_active', String(params.is_active));
    }
    if (params?.search) {
      searchParams.append('search', params.search);
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/products/${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to fetch products (${res.status})`);
    }
    return res.json();
  },

  // Fetch single product by id
  async getById(id: number | string): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to fetch product ${id}`);
    }
    return res.json();
  },

  // Create new product
  async create(data: ProductFormData): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name.trim(),
        img_url: data.img_url.trim() || null,
        description: data.description.trim() || null,
        type: data.type.trim() || null,
        is_active: data.is_active,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to create product (${res.status})`);
    }
    return res.json();
  },

  // Update product
  async update(id: number | string, data: Partial<ProductFormData>): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.img_url !== undefined && { img_url: data.img_url.trim() || null }),
        ...(data.description !== undefined && { description: data.description.trim() || null }),
        ...(data.type !== undefined && { type: data.type.trim() || null }),
        ...(data.is_active !== undefined && { is_active: data.is_active }),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to update product (${res.status})`);
    }
    return res.json();
  },

  // Delete product
  async delete(id: number | string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to delete product (${res.status})`);
    }
  },

  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }
};
