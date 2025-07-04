import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Save, Upload, Settings, Image, Download, FileUp, Package, RefreshCw } from 'lucide-react';
import { Product, StoreSettings } from '../types/Product';
import { formatPrice } from '../utils/email';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createMultipleProducts,
  updateStoreSettings 
} from '../services/database';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  settings: StoreSettings;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onLogout: () => void;
  onRefreshProducts: () => Promise<void>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  settings,
  onUpdateProducts,
  onUpdateSettings,
  onLogout,
  onRefreshProducts
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'banners'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [editingSettings, setEditingSettings] = useState<StoreSettings | null>(null);
  const [bulkProducts, setBulkProducts] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    price: 0,
    category: settings.categories[0] || '',
    quantity: 0,
    image: '',
    description: ''
  });

  // Image upload handler
  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      callback(result);
    };
    reader.readAsDataURL(file);
  };

  // Bulk add products
  const handleBulkAddProducts = async () => {
    try {
      setIsLoading(true);
      const lines = bulkProducts.trim().split('\n');
      const newProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [];
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        const parts = line.split(',').map(part => part.trim());
        if (parts.length < 5) {
          alert(`Invalid line format: ${line}\nExpected: Name, Price, Category, Quantity, Description`);
          return;
        }
        
        const [name, priceStr, category, quantityStr, ...descriptionParts] = parts;
        const price = parseFloat(priceStr);
        const quantity = parseInt(quantityStr);
        const description = descriptionParts.join(', ');
        
        if (isNaN(price) || isNaN(quantity)) {
          alert(`Invalid price or quantity in line: ${line}`);
          return;
        }
        
        const product = {
          name,
          price,
          category: category.toLowerCase(),
          quantity,
          image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
          description
        };
        
        newProducts.push(product);
      }
      
      await createMultipleProducts(newProducts);
      await onRefreshProducts();
      setBulkProducts('');
      setIsBulkAdding(false);
      alert(`Successfully added ${newProducts.length} products!`);
    } catch (error) {
      console.error('Error adding bulk products:', error);
      alert('Error processing bulk products. Please check the format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (editingProduct) {
      setIsLoading(true);
      try {
        await updateProduct(editingProduct.id, editingProduct);
        await onRefreshProducts();
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Error updating product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddProduct = async () => {
    setIsLoading(true);
    try {
      await createProduct(newProduct);
      await onRefreshProducts();
      setNewProduct({
        name: '',
        price: 0,
        category: settings.categories[0] || '',
        quantity: 0,
        image: '',
        description: ''
      });
      setIsAddingProduct(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      try {
        await deleteProduct(productId);
        await onRefreshProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveSettings = async () => {
    if (editingSettings) {
      setIsLoading(true);
      try {
        await updateStoreSettings(editingSettings);
        onUpdateSettings(editingSettings);
        setEditingSettings(null);
      } catch (error) {
        console.error('Error updating settings:', error);
        alert('Error updating settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddCategory = () => {
    if (editingSettings) {
      const newCategory = prompt('Enter new category name:');
      if (newCategory && newCategory.trim()) {
        setEditingSettings({
          ...editingSettings,
          categories: [...editingSettings.categories, newCategory.trim().toLowerCase()]
        });
      }
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    if (editingSettings && confirm(`Remove category "${categoryToRemove}"?`)) {
      setEditingSettings({
        ...editingSettings,
        categories: editingSettings.categories.filter(cat => cat !== categoryToRemove)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={onRefreshProducts}
              disabled={isLoading}
              className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Logout
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'settings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'banners'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Banners & Content
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsBulkAdding(true)}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Bulk Add
                  </button>
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>

              {isBulkAdding && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4">Bulk Add Products</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter one product per line in the format: <br />
                    <code className="bg-gray-200 px-2 py-1 rounded">Name, Price, Category, Quantity, Description</code>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Example: <br />
                    <code className="bg-gray-200 px-2 py-1 rounded">Arduino Nano, 350.50, microcontrollers, 20, Compact Arduino board</code>
                  </p>
                  <textarea
                    value={bulkProducts}
                    onChange={(e) => setBulkProducts(e.target.value)}
                    placeholder="Arduino Nano, 350.50, microcontrollers, 20, Compact Arduino board&#10;LED Strip 5m, 450.75, modules, 15, RGB LED strip with controller&#10;Breadboard 830, 85.25, tools, 30, Half-size solderless breadboard"
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={handleBulkAddProducts}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Adding...' : 'Add All Products'}
                    </button>
                    <button
                      onClick={() => setIsBulkAdding(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {isAddingProduct && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4">Add New Product</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (CZK)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {settings.categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (url) => setNewProduct({...newProduct, image: url}));
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {newProduct.image && (
                          <img src={newProduct.image} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={handleAddProduct}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Product'}
                    </button>
                    <button
                      onClick={() => setIsAddingProduct(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    {editingProduct?.id === product.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {settings.categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <input
                            type="number"
                            value={editingProduct.quantity}
                            onChange={(e) => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, (url) => setEditingProduct({...editingProduct, image: url}));
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {editingProduct.image && (
                              <img src={editingProduct.image} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2 flex space-x-4">
                          <button
                            onClick={handleSaveProduct}
                            disabled={isLoading}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                          <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                          <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            disabled={isLoading}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isLoading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Store Settings</h3>
                <button
                  onClick={() => setEditingSettings(settings)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Settings
                </button>
              </div>
              
              {editingSettings ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={editingSettings.contact.email}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            contact: {...editingSettings.contact, email: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editingSettings.contact.phone}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            contact: {...editingSettings.contact, phone: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={editingSettings.contact.address}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            contact: {...editingSettings.contact, address: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editingSettings.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                          <button
                            onClick={() => handleRemoveCategory(category)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={handleAddCategory}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add Category
                    </button>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                    <button
                      onClick={() => setEditingSettings(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong>Email:</strong> {settings.contact.email}</p>
                      <p><strong>Phone:</strong> {settings.contact.phone}</p>
                      <p><strong>Address:</strong> {settings.contact.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {settings.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'banners' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Banners & Content Management</h3>
                <button
                  onClick={() => setEditingSettings(settings)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Edit Content
                </button>
              </div>
              
              {editingSettings ? (
                <div className="space-y-8">
                  {/* Hero Banner */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Hero Banner</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, (url) => setEditingSettings({
                                  ...editingSettings,
                                  banners: {...editingSettings.banners, hero: url}
                                }));
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {editingSettings.banners.hero && (
                          <div className="mt-4">
                            <img src={editingSettings.banners.hero} alt="Hero Banner" className="w-full h-32 object-cover rounded-md" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                        <input
                          type="text"
                          value={editingSettings.content?.heroTitle || 'OK Industries'}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            content: {...(editingSettings.content || {}), heroTitle: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                        <input
                          type="text"
                          value={editingSettings.content?.heroSubtitle || 'Your trusted partner for electronic components'}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            content: {...(editingSettings.content || {}), heroSubtitle: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3D Printing Services Banner */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">3D Printing Services</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">3D Printing Banner Image</label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, (url) => setEditingSettings({
                                  ...editingSettings,
                                  banners: {...editingSettings.banners, printing3d: url}
                                }));
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {editingSettings.banners.printing3d && (
                          <div className="mt-4">
                            <img src={editingSettings.banners.printing3d} alt="3D Printing" className="w-full h-32 object-cover rounded-md" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">3D Printing Title</label>
                        <input
                          type="text"
                          value={editingSettings.content?.printing3dTitle || 'Professional 3D Printing Services'}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            content: {...(editingSettings.content || {}), printing3dTitle: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">3D Printing Description</label>
                        <textarea
                          value={editingSettings.content?.printing3dDescription || 'High-quality 3D printing services for prototypes, custom parts, and small-scale production.'}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            content: {...(editingSettings.content || {}), printing3dDescription: e.target.value}
                          })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PCB Manufacturing Banner */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">PCB Manufacturing Services</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PCB Manufacturing Banner Image</label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, (url) => setEditingSettings({
                                  ...editingSettings,
                                  banners: {...editingSettings.banners, pcbManufacturing: url}
                                }));
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {editingSettings.banners.pcbManufacturing && (
                          <div className="mt-4">
                            <img src={editingSettings.banners.pcbManufacturing} alt="PCB Manufacturing" className="w-full h-32 object-cover rounded-md" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PCB Manufacturing Title</label>
                        <input
                          type="text"
                          value={editingSettings.content?.pcbTitle || 'Custom PCB Manufacturing'}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            content: {...(editingSettings.content || {}), pcbTitle: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PCB Manufacturing Description</label>
                        <textarea
                          value={editingSettings.content?.pcbDescription || 'Professional PCB design and manufacturing services from prototype to production.'}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            content: {...(editingSettings.content || {}), pcbDescription: e.target.value}
                          })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save All Changes'}
                    </button>
                    <button
                      onClick={() => setEditingSettings(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Current Hero Banner */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Current Hero Banner</h4>
                    <div className="space-y-4">
                      <img src={settings.banners.hero} alt="Hero Banner" className="w-full h-32 object-cover rounded-md" />
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p><strong>Title:</strong> {settings.content?.heroTitle || 'OK Industries'}</p>
                        <p><strong>Subtitle:</strong> {settings.content?.heroSubtitle || 'Your trusted partner for electronic components'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current 3D Printing Banner */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Current 3D Printing Services</h4>
                    <div className="space-y-4">
                      {settings.banners.printing3d && (
                        <img src={settings.banners.printing3d} alt="3D Printing" className="w-full h-32 object-cover rounded-md" />
                      )}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p><strong>Title:</strong> {settings.content?.printing3dTitle || 'Professional 3D Printing Services'}</p>
                        <p><strong>Description:</strong> {settings.content?.printing3dDescription || 'High-quality 3D printing services for prototypes, custom parts, and small-scale production.'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current PCB Manufacturing Banner */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Current PCB Manufacturing Services</h4>
                    <div className="space-y-4">
                      {settings.banners.pcbManufacturing && (
                        <img src={settings.banners.pcbManufacturing} alt="PCB Manufacturing" className="w-full h-32 object-cover rounded-md" />
                      )}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p><strong>Title:</strong> {settings.content?.pcbTitle || 'Custom PCB Manufacturing'}</p>
                        <p><strong>Description:</strong> {settings.content?.pcbDescription || 'Professional PCB design and manufacturing services from prototype to production.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;