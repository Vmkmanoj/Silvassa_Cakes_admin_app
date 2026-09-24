import React, { useState, useEffect } from 'react';
import {type Product,type ProductFormData } from '../types/product';
import { X, Sparkles, AlertTriangle } from './Icons';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Product | null;
  mode: 'add' | 'edit';
}

const PRESET_IMAGES = [
  { name: 'Grilled Beef Steak', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', type: 'Steak' },
  { name: 'Duck Noodles', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80', type: 'Noodles' },
  { name: 'Spaghetti Carbonara', url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=80', type: 'Pasta' },
  { name: 'Grilled Chicken Salad', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80', type: 'Salad' },
  { name: 'Thai Chicken Delight', url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80', type: 'Chicken' },
  { name: 'Berry Pancakes & Waffles', url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80', type: 'Dessert' },
  { name: 'Shrimp Black Pasta', url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&auto=format&fit=crop&q=80', type: 'Seafood' },
  { name: 'Strawberries Dessert', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80', type: 'Dessert' },
];

const PRESET_TYPES = ['Main Course', 'Steak', 'Noodles', 'Pasta', 'Salad', 'Chicken', 'Seafood', 'Dessert', 'Beverage', 'Breakfast'];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    img_url: '',
    description: '',
    type: 'Main Course',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        img_url: initialData.img_url || '',
        description: initialData.description || '',
        type: initialData.type || 'Main Course',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
      });
    } else {
      setFormData({
        name: '',
        img_url: '',
        description: '',
        type: 'Main Course',
        is_active: true,
      });
    }
    setFormError(null);
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while saving the product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_IMAGES[0]) => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name || preset.name,
      img_url: preset.url,
      type: preset.type,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {mode === 'add' ? 'Add New Product' : 'Edit Product'}
            </h2>
            <p className="modal-subtitle">
              {mode === 'add'
                ? 'Create a new dish or item for the Yum-Tum menu'
                : `Update details for "${initialData?.name || 'Product'}"`}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="modal-error">
            <AlertTriangle size={18} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Grilled Beef Steak with Garlic Butter"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Category / Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {PRESET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Active Status</label>
              <div className="status-toggle-wrapper">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className={`status-label ${formData.is_active ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {formData.is_active ? 'Active on Menu' : 'Hidden / Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={formData.img_url}
              onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
            />

            {/* Quick preset selector */}
            <div className="presets-container">
              <span className="presets-title">
                <Sparkles size={13} /> Quick Image Presets:
              </span>
              <div className="presets-list">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="preset-btn"
                    onClick={() => handleApplyPreset(preset)}
                    title={preset.name}
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            {formData.img_url && (
              <div className="img-preview-box">
                <img
                  src={formData.img_url}
                  alt="Preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="preview-tag">Image Preview</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe the dish ingredients, taste profile, or serving details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : mode === 'add' ? (
                'Create Product'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
