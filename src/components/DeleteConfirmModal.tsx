import React, { useState } from 'react';
import {type Product } from '../types/product';
import { Trash2 } from './Icons';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  product: Product | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-box">
          <Trash2 size={28} className="text-rose-400" />
        </div>

        <h3 className="confirm-title">Delete Product?</h3>
        <p className="confirm-text">
          Are you sure you want to delete <strong>"{product.name}"</strong>? This will remove it permanently from Supabase and the menu.
        </p>

        <div className="modal-footer justify-center">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
