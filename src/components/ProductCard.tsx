import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product, StockStatus } from '../types/Product';
import { formatPrice } from '../utils/email';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  gridSize: 'small' | 'medium' | 'large';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  gridSize
}) => {
  const getStockStatus = (quantity: number): StockStatus => {
    if (quantity > 0) return 'in-stock';
    if (quantity === 0) return 'out-of-stock';
    return 'coming-soon';
  };

  const getStockDisplay = (quantity: number) => {
    const status = getStockStatus(quantity);
    switch (status) {
      case 'in-stock':
        return {
          text: `In stock ${quantity} pcs`,
          color: 'text-green-600 bg-green-50'
        };
      case 'out-of-stock':
        return {
          text: 'Out of stock',
          color: 'text-red-600 bg-red-50'
        };
      case 'coming-soon':
        return {
          text: 'Coming soon',
          color: 'text-blue-600 bg-blue-50'
        };
    }
  };

  const stockDisplay = getStockDisplay(product.quantity);
  const canAddToCart = product.quantity > 0;

  const cardClasses = {
    small: 'w-full',
    medium: 'w-full',
    large: 'w-full'
  };

  const imageClasses = {
    small: 'h-32',
    medium: 'h-40',
    large: 'h-48'
  };

  return (
    <div className={`${cardClasses[gridSize]} bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full ${imageClasses[gridSize]} object-cover`}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockDisplay.color}`}>
            {stockDisplay.text}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </button>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={!canAddToCart}
            className={`flex-1 px-4 py-2 rounded-md transition-colors flex items-center justify-center ${
              canAddToCart
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;