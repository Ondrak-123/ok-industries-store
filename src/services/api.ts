const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// API service for products
export const productApi = {
  // Get all products
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error - getAll products:', error);
      throw error;
    }
  },

  // Create a single product
  create: async (product: any) => {
    try {
      const newProduct = {
        ...product,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error - create product:', error);
      throw error;
    }
  },

  // Create multiple products
  createBulk: async (products: any[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error - createBulk products:', error);
      throw error;
    }
  },

  // Update a product
  update: async (id: string, updates: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error - update product:', error);
      throw error;
    }
  },

  // Delete a product
  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return true;
    } catch (error) {
      console.error('API Error - delete product:', error);
      throw error;
    }
  }
};

// API service for store settings
export const settingsApi = {
  // Get store settings
  get: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/store_settings`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const settings = await response.json();
      return settings[0] || null; // Return first settings object
    } catch (error) {
      console.error('API Error - get settings:', error);
      throw error;
    }
  },

  // Update store settings
  update: async (settings: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/store_settings/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error - update settings:', error);
      throw error;
    }
  }
};

// API service for orders
export const orderApi = {
  // Create an order
  create: async (order: any) => {
    try {
      const newOrder = {
        ...order,
        id: generateId(),
        createdAt: new Date().toISOString()
      };
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error - create order:', error);
      throw error;
    }
  },

  // Get all orders
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API Error - getAll orders:', error);
      throw error;
    }
  }
};