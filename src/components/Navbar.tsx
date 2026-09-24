import React from 'react';
import { UtensilsCrossed, Plus, RefreshCw, Database } from './Icons';

interface NavbarProps {
  onAddClick: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isConnected: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddClick,
  onRefresh,
  isLoading,
  isConnected,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <div className="brand-logo">
            <UtensilsCrossed size={22} className="text-orange-400" />
          </div>
          <div>
            <div className="brand-title">
              Yum-Tum <span className="brand-tag">Admin</span>
            </div>
            <div className="brand-sub">Menu & Product Management Portal</div>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        {/* Backend status pill */}
        <div
          className={`connection-pill ${
            isConnected === true
              ? 'conn-online'
              : isConnected === false
              ? 'conn-offline'
              : 'conn-checking'
          }`}
          title="FastAPI Backend Status (http://localhost:8001)"
        >
          <Database size={14} />
          <span>
            {isConnected === true
              ? 'Supabase / API Connected'
              : isConnected === false
              ? 'Backend Offline'
              : 'Connecting...'}
          </span>
          <span className="conn-dot"></span>
        </div>

        {/* Refresh button */}
        <button
          className={`btn-icon ${isLoading ? 'btn-spinning' : ''}`}
          onClick={onRefresh}
          title="Refresh Data"
          disabled={isLoading}
        >
          <RefreshCw size={17} />
        </button>

        {/* Add product CTA */}
        <button className="btn btn-primary" onClick={onAddClick}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>
    </header>
  );
};
