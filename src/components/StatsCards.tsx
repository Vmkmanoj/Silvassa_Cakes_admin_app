import React from 'react';
import {type Product } from '../types/product';
import { Package, CheckCircle, AlertTriangle, Layers } from './Icons';

interface StatsCardsProps {
  products: Product[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ products }) => {
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.is_active !== false).length;
  const inactiveCount = totalCount - activeCount;
  const categories = new Set(products.map((p) => p.type).filter(Boolean)).size;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-orange">
          <Package size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Products</span>
          <h3 className="stat-value">{totalCount}</h3>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-green">
          <CheckCircle size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Active on Menu</span>
          <h3 className="stat-value">{activeCount}</h3>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-amber">
          <AlertTriangle size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Hidden / Inactive</span>
          <h3 className="stat-value">{inactiveCount}</h3>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-purple">
          <Layers size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Categories</span>
          <h3 className="stat-value">{categories || '—'}</h3>
        </div>
      </div>
    </div>
  );
};
