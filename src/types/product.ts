export interface Product {
  id: number | string;
  name: string;
  img_url?: string | null;
  description?: string | null;
  type?: string | null;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProductFormData {
  name: string;
  img_url: string;
  description: string;
  type: string;
  is_active: boolean;
}

export type ViewMode = 'grid' | 'table';
export type FilterStatus = 'all' | 'active' | 'inactive';
