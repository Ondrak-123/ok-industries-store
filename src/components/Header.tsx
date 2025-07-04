import React from 'react';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { CartItem } from '../types/Product';

interface HeaderProps {
  cartItems: CartItem[];
  onCartClick: () => void;
  onAdminClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({
  cartItems,
  onCartClick,
  onAdminClick,
  searchTerm,
  onSearchChange,
  isMenuOpen,
  onMenuToggle,
  isAdmin
}) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">OK Industries</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onAdminClick}
              className={`p-2 rounded-full ${isAdmin ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <User className="h-6 w-6" />
            </button>
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={onMenuToggle}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={onAdminClick}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isAdmin ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  <User className="h-5 w-5 mr-2" />
                  Admin
                </button>
                <button
                  onClick={onCartClick}
                  className="relative flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                  {totalItems > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;