import React from 'react';
import {type Product } from '../types/product';
import { Edit3, Trash2 } from './Icons';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleActive: (product: Product) => void;
}

const DEFAULT_FOOD_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div className={`product-card ${!product.is_active ? 'card-inactive' : ''}`}>
      <div className="card-media">
        <img
          src={product.img_url || DEFAULT_FOOD_IMG}
          alt={product.name}
          className="card-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMG;
          }}
        />
        {product.type && <span className="card-type-badge">{product.type}</span>}
        <div className="card-status-badge">
          <span className={`status-dot ${product.is_active ? 'dot-active' : 'dot-inactive'}`}></span>
          <span>{product.is_active ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title" title={product.name}>
            {product.name}
          </h3>
        </div>

        <p className="card-desc">
          {product.description || 'No description provided for this product.'}
        </p>

        <div className="card-footer">
          <div className="card-toggle-group" onClick={() => onToggleActive(product)}>
            <label className="toggle-switch-sm">
              <input
                type="checkbox"
                checked={product.is_active ?? true}
                onChange={() => onToggleActive(product)}
              />
              <span className="toggle-slider-sm"></span>
            </label>
            <span className="toggle-label-text">
              {product.is_active ? 'Live' : 'Hidden'}
            </span>
          </div>

          <div className="card-actions">
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
        </div>
      </div>
    </div>
  );
};
