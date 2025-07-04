export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

export interface StoreSettings {
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  categories: string[];
  banners: {
    hero: string;
    service: string;
    printing3d?: string;
    pcbManufacturing?: string;
  };
  content?: {
    heroTitle?: string;
    heroSubtitle?: string;
    printing3dTitle?: string;
    printing3dDescription?: string;
    pcbTitle?: string;
    pcbDescription?: string;
  };
}

export type StockStatus = 'in-stock' | 'out-of-stock' | 'coming-soon';