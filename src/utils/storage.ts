import { Product, Order, StoreSettings } from '../types/Product';

const STORAGE_KEYS = {
  PRODUCTS: 'ok-industries-products',
  ORDERS: 'ok-industries-orders',
  SETTINGS: 'ok-industries-settings',
  ADMIN_SESSION: 'ok-industries-admin-session'
};

export const storage = {
  // Products
  getProducts: (): Product[] => {
    const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return products ? JSON.parse(products) : [];
  },

  saveProducts: (products: Product[]): void => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // Orders
  getOrders: (): Order[] => {
    const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return orders ? JSON.parse(orders) : [];
  },

  saveOrders: (orders: Order[]): void => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  // Settings
  getSettings: (): StoreSettings => {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : getDefaultSettings();
  },

  saveSettings: (settings: StoreSettings): void => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Admin session
  getAdminSession: (): boolean => {
    const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    return session === 'true';
  },

  saveAdminSession: (isLoggedIn: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, isLoggedIn.toString());
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

function getDefaultSettings(): StoreSettings {
  return {
    contact: {
      email: 'info@okindustries.cz',
      phone: '+420 123 456 789',
      address: 'Prague, Czech Republic'
    },
    categories: [
      'diodes',
      'resistors',
      'inductors',
      'capacitors',
      'modules',
      'sensors',
      'microcontrollers',
      'wires',
      'installation',
      'tools',
      'spare parts'
    ],
    banners: {
      hero: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      service: 'https://images.pexels.com/photos/442152/pexels-photo-442152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      printing3d: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
      pcbManufacturing: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1'
    },
    content: {
      heroTitle: 'OK Industries',
      heroSubtitle: 'Your trusted partner for electronic components',
      printing3dTitle: 'Professional 3D Printing Services',
      printing3dDescription: 'High-quality 3D printing services for prototypes, custom parts, and small-scale production.',
      pcbTitle: 'Custom PCB Manufacturing',
      pcbDescription: 'Professional PCB design and manufacturing services from prototype to production.'
    }
  };
}