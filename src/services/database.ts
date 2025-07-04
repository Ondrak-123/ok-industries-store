import { Product, StoreSettings, Order } from '../types/Product';
import { productApi, settingsApi, orderApi } from './api';

// Products
export const getProducts = async (): Promise<Product[]> => {
  try {
    return await productApi.getAll();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> => {
  try {
    return await productApi.create(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    return await productApi.update(id, updates);
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await productApi.delete(id);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

export const createMultipleProducts = async (products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Product[]> => {
  try {
    return await productApi.createBulk(products);
  } catch (error) {
    console.error('Error creating multiple products:', error);
    return [];
  }
};

// Store Settings
export const getStoreSettings = async (): Promise<StoreSettings | null> => {
  try {
    return await settingsApi.get();
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return null;
  }
};

export const updateStoreSettings = async (settings: StoreSettings): Promise<StoreSettings | null> => {
  try {
    return await settingsApi.update(settings);
  } catch (error) {
    console.error('Error updating store settings:', error);
    return null;
  }
};

// Orders
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order | null> => {
  try {
    return await orderApi.create(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    return await orderApi.getAll();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};