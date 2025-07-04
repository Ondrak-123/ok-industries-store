import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '../types/Product';
import { formatPrice } from '../utils/email';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const getStockDisplay = (quantity: number) => {
    if (quantity > 0) return {
      text: `In stock ${quantity} pcs`,
      color: 'text-green-600 bg-green-50'
    };
    if (quantity === 0) return {
      text: 'Out of stock',
      color: 'text-red-600 bg-red-50'
    };
    return {
      text: 'Coming soon',
      color: 'text-blue-600 bg-blue-50'
    };
  };

  const stockDisplay = getStockDisplay(product.quantity);
  const canAddToCart = product.quantity > 0;
  const maxQuantity = Math.min(product.quantity, 10);

  const handleAddToCart = () => {
    if (canAddToCart) {
      onAddToCart(product, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h2>
                
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockDisplay.color}`}>
                    {stockDisplay.text}
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                
                {canAddToCart && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className={`w-full py-3 px-4 rounded-md transition-colors flex items-center justify-center ${
                    canAddToCart
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {canAddToCart ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Product Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;