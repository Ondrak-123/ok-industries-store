import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { CartItem } from '../types/Product';
import { formatPrice } from '../utils/email';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onSubmitOrder: (customerName: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  cartItems,
  onSubmitOrder
}) => {
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setIsSubmitting(true);
    await onSubmitOrder(customerName.trim());
    setIsSubmitting(false);
    setCustomerName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Order Inquiry</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Order Inquiry Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800 mb-1">Order Inquiry Notice</h3>
                <p className="text-sm text-blue-700">
                  This is an inquiry form only. Submitting this form will send your product interest to our team 
                  for review. We will contact you to confirm availability, pricing, and arrange the actual order.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products of Interest</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Estimated Total:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                *Final pricing subject to confirmation
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!customerName.trim() || isSubmitting}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;