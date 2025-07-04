import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import ShoppingCart from './components/ShoppingCart';
import OrderForm from './components/OrderForm';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import ProductFilters from './components/ProductFilters';
import ServiceBanners from './components/ServiceBanners';
import { Product, CartItem, Order, StoreSettings } from './types/Product';
import { storage } from './utils/storage';
import { sendOrderEmail, generateOrderId } from './utils/email';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createMultipleProducts,
  getStoreSettings, 
  updateStoreSettings, 
  createOrder 
} from './services/database';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    contact: { email: '', phone: '', address: '' },
    categories: [],
    banners: { hero: '', service: '' },
    content: {}
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      try {
        // Load products from database
        const dbProducts = await getProducts();
        setProducts(dbProducts);
        
        // Load settings from database
        const dbSettings = await getStoreSettings();
        if (dbSettings) {
          setSettings(dbSettings);
        }
        
        // Check admin session from localStorage
        const adminSession = storage.getAdminSession();
        setIsAdminLoggedIn(adminSession);
      } catch (error) {
        console.error('Error initializing data:', error);
        // Fallback to localStorage if database fails
        const storedProducts = storage.getProducts();
        const storedSettings = storage.getSettings();
        setProducts(storedProducts);
        setSettings(storedSettings);
      }
      
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Grid columns based on size
  const getGridColumns = () => {
    switch (gridSize) {
      case 'small':
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      case 'medium':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'large':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (product.quantity <= 0) return;
    
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      const newQuantity = Math.min(existingItem.quantity + quantity, product.quantity);
      setCartItems(cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, quantity }]);
    }
  };

  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const handleSubmitOrder = async (customerName: string) => {
    const order: Order = {
      id: generateOrderId(),
      customerName,
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // Create order in database
      await createOrder(order);

      // Update product quantities in database
      for (const cartItem of cartItems) {
        const product = products.find(p => p.id === cartItem.product.id);
        if (product) {
          await updateProduct(product.id, {
            quantity: product.quantity - cartItem.quantity
          });
        }
      }

      // Refresh products from database
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);

      // Send email
      await sendOrderEmail(order);

      // Clear cart
      setCartItems([]);
      
      alert('Order inquiry submitted successfully! We will contact you to confirm availability and arrange the order.');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  const handleAdminLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'xPle?1{I_MT@') {
      setIsAdminLoggedIn(true);
      storage.saveAdminSession(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    storage.saveAdminSession(false);
    setIsAdminPanelOpen(false);
  };

  const handleUpdateProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    // Products are updated individually through the database service
  };

  const handleUpdateSettings = async (newSettings: StoreSettings) => {
    try {
      const updatedSettings = await updateStoreSettings(newSettings);
      if (updatedSettings) {
        setSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItems={cartItems}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={handleAdminClick}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isAdmin={isAdminLoggedIn}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-lg overflow-hidden">
          <img
            src={settings.banners.hero}
            alt="Electronics Store"
            className="w-full h-64 sm:h-80 lg:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                {settings.content?.heroTitle || 'OK Industries'}
              </h1>
              <p className="text-xl sm:text-2xl">
                {settings.content?.heroSubtitle || 'Your trusted partner for electronic components'}
              </p>
            </div>
          </div>
        </div>

        {/* Service Banners */}
        <ServiceBanners settings={settings} />

        {/* Filters */}
        <ProductFilters
          categories={settings.categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          gridSize={gridSize}
          onGridSizeChange={setGridSize}
        />

        {/* Products Grid */}
        <div className={`grid ${getGridColumns()} gap-6`}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(product) => handleAddToCart(product, 1)}
              onViewDetails={setSelectedProduct}
              gridSize={gridSize}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer settings={settings} />

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsOrderFormOpen(true);
        }}
      />

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        cartItems={cartItems}
        onSubmitOrder={handleSubmitOrder}
      />

      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLogin={handleAdminLogin}
      />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        products={products}
        settings={settings}
        onUpdateProducts={handleUpdateProducts}
        onUpdateSettings={handleUpdateSettings}
        onLogout={handleAdminLogout}
        onRefreshProducts={async () => {
          const updatedProducts = await getProducts();
          setProducts(updatedProducts);
        }}
      />
    </div>
  );
}

export default App;