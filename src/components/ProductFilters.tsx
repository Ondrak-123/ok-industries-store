import React from 'react';
import { Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: 'price-asc' | 'price-desc' | 'name';
  onSortChange: (sort: 'price-asc' | 'price-desc' | 'name') => void;
  gridSize: 'small' | 'medium' | 'large';
  onGridSizeChange: (size: 'small' | 'medium' | 'large') => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  gridSize,
  onGridSizeChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => onSortChange('price-asc')}
              className={`px-3 py-2 rounded-md text-sm flex items-center space-x-1 transition-colors ${
                sortBy === 'price-asc' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SortAsc className="h-4 w-4" />
              <span>Price ↑</span>
            </button>
            <button
              onClick={() => onSortChange('price-desc')}
              className={`px-3 py-2 rounded-md text-sm flex items-center space-x-1 transition-colors ${
                sortBy === 'price-desc' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SortDesc className="h-4 w-4" />
              <span>Price ↓</span>
            </button>
            <button
              onClick={() => onSortChange('name')}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                sortBy === 'name' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Name
            </button>
          </div>
        </div>
        
        {/* Grid Size Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Grid:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => onGridSizeChange('small')}
              className={`p-2 rounded-md transition-colors ${
                gridSize === 'small' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onGridSizeChange('medium')}
              className={`p-2 rounded-md transition-colors ${
                gridSize === 'medium' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onGridSizeChange('large')}
              className={`p-2 rounded-md transition-colors ${
                gridSize === 'large' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;