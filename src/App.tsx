import { useState, useEffect, useMemo, useCallback } from 'react';
import { type Product, type ProductFormData, type ViewMode, type FilterStatus } from './types/product';
import { productApi } from './services/api';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { ProductModal } from './components/ProductModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer, type ToastMessage } from './components/Toast';
import {
  Search,
  LayoutGrid,
  ListFilter,
  Plus,
  Package,
  AlertTriangle,
  Sparkles,
} from './components/Icons';
import './App.css';

const SAMPLE_STARTER_ITEMS: ProductFormData[] = [
  {
    name: 'Grilled Beef Steak',
    img_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    description: 'Juicy prime cut beef steak served with rosemary butter and garlic roast potatoes.',
    type: 'Steak',
    is_active: true,
  },
  {
    name: 'Duck Noodles',
    img_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    description: 'Slow-braised savory duck breast in rich broth with egg noodles and pak choi.',
    type: 'Noodles',
    is_active: true,
  },
  {
    name: 'Spaghetti Carbonara',
    img_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=80',
    description: 'Authentic Italian pasta with crispy pancetta, parmesan, egg yolk, and black pepper.',
    type: 'Pasta',
    is_active: true,
  },
  {
    name: 'Grilled Chicken Salad',
    img_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    description: 'Tender herb grilled chicken with crisp mixed greens, avocado, cherry tomatoes, and vinaigrette.',
    type: 'Salad',
    is_active: true,
  },
  {
    name: 'Thai Chicken Delight',
    img_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
    description: 'Spicy and aromatic wok-tossed chicken with Thai basil, chillies, and jasmine rice.',
    type: 'Chicken',
    is_active: true,
  },
  {
    name: 'Strawberries Arnaud Dessert',
    img_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    description: 'Fresh Louisiana strawberries in sweet port wine marinade with rich vanilla bean cream.',
    type: 'Dessert',
    is_active: true,
  },
];

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      text,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch products
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await productApi.getAll();
      setProducts(data);
      setIsConnected(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to load products from backend.');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.type && p.type.trim()) {
        set.add(p.type.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.type?.toLowerCase().includes(query);

      // Category match
      const matchesCategory =
        selectedCategory === 'All' || p.type?.toLowerCase() === selectedCategory.toLowerCase();

      // Status match
      const isActive = p.is_active !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData: ProductFormData) => {
    if (modalMode === 'add') {
      const created = await productApi.create(formData);
      setProducts((prev) => [created, ...prev]);
      addToast('success', `Product "${created.name}" created successfully!`);
    } else if (selectedProduct) {
      const updated = await productApi.update(selectedProduct.id, formData);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? { ...p, ...updated } : p))
      );
      addToast('success', `Product "${updated.name}" updated successfully!`);
    }
  };

  // Delete Handlers
  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await productApi.delete(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      addToast('success', `Product "${productToDelete.name}" deleted.`);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete product.');
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (product: Product) => {
    const newStatus = !(product.is_active ?? true);
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: newStatus } : p))
    );

    try {
      await productApi.update(product.id, { is_active: newStatus });
      addToast(
        'info',
        `"${product.name}" is now ${newStatus ? 'Active' : 'Hidden from menu'}.`
      );
    } catch (err: any) {
      // Revert on failure
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: !newStatus } : p))
      );
      addToast('error', err.message || 'Failed to update status.');
    }
  };

  // Seed initial starter menu
  const handleSeedStarterItems = async () => {
    setIsLoading(true);
    let successCount = 0;
    try {
      for (const item of SAMPLE_STARTER_ITEMS) {
        try {
          await productApi.create(item);
          successCount++;
        } catch {
          // ignore duplicate / errors
        }
      }
      await loadProducts();
      addToast('success', `Added ${successCount} sample Yum-Tum menu items to Supabase!`);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to seed sample items.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Navigation */}
      <Navbar
        onAddClick={handleOpenAddModal}
        onRefresh={loadProducts}
        isLoading={isLoading}
        isConnected={isConnected}
      />

      <main className="main-content">
        {/* Error Banner if connection failed or table missing */}
        {errorMessage && (
          <div className="alert-banner">
            <AlertTriangle size={24} className="text-rose-400" />
            <div>
              <div className="alert-banner-title">Database Connection Issue</div>
              <div className="alert-banner-desc">
                {errorMessage}
                {errorMessage.includes('public.products') && (
                  <p style={{ marginTop: '6px', fontSize: '0.8rem', opacity: 0.9 }}>
                    Tip: Ensure the <code>products</code> table exists in your Supabase SQL Editor.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Dashboard */}
        <StatsCards products={products} />

        {/* Controls & Filter Bar */}
        <div className="controls-card">
          <div className="controls-top-row">
            {/* Search */}
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search dish by name, type, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter by Status & View Toggle */}
            <div className="controls-filters">
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive / Hidden</option>
              </select>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <ListFilter size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          {categories.length > 1 && (
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product List Content */}
        {filteredProducts.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onToggleActive={handleToggleActive}
            />
          )
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Package size={32} />
            </div>
            <h3 className="empty-title">
              {products.length === 0 ? 'No Products in Menu Yet' : 'No Matching Products Found'}
            </h3>
            <p className="empty-desc">
              {products.length === 0
                ? 'Get started by creating your first restaurant item or load sample Yum-Tum dishes.'
                : 'Try adjusting your search keywords, status filter, or category selector.'}
            </p>
            {products.length === 0 ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
                  <Plus size={16} />
                  <span>Create First Product</span>
                </button>
                <button className="btn btn-secondary" onClick={handleSeedStarterItems}>
                  <Sparkles size={16} />
                  <span>Load Sample Menu</span>
                </button>
              </div>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedProduct}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        product={productToDelete}
      />
    </div>
  );
}

export default App;
