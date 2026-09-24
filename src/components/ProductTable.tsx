import React from 'react';
import { type Product } from '../types/product';
import { Edit3, Trash2 } from './Icons';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleActive: (product: Product) => void;
}

const DEFAULT_FOOD_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={!product.is_active ? 'row-inactive' : ''}>
              <td>
                <div className="table-product-cell">
                  <img
                    src={product.img_url || DEFAULT_FOOD_IMG}
                    alt={product.name}
                    className="table-product-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMG;
                    }}
                  />
                  <div>
                    <div className="table-product-name">{product.name}</div>
                    <div className="table-product-id">ID: #{product.id}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className="table-type-badge">{product.type || 'General'}</span>
              </td>
              <td>
                <span className="table-desc-text" title={product.description || ''}>
                  {product.description || '—'}
                </span>
              </td>
              <td>
                <div className="card-toggle-group" onClick={() => onToggleActive(product)}>
                  <label className="toggle-switch-sm">
                    <input
                      type="checkbox"
                      checked={product.is_active ?? true}
                      onChange={() => onToggleActive(product)}
                    />
                    <span className="toggle-slider-sm"></span>
                  </label>
                  <span className={`status-pill ${product.is_active ? 'status-pill-active' : 'status-pill-inactive'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </td>
              <td>
                <span className="table-date">
                  {product.updated_at
                    ? new Date(product.updated_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : product.created_at
                    ? new Date(product.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—'}
                </span>
              </td>
              <td>
                <div className="table-actions-cell">
                  <button
                    className="action-btn action-edit"
                    onClick={() => onEdit(product)}
                    title="Edit Product"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="action-btn action-delete"
                    onClick={() => onDelete(product)}
                    title="Delete Product"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
