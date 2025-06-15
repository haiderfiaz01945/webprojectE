import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProducts } from '../../firebaseService';
import { useCart } from '../Componenets/CartContext';
import { FiShoppingCart, FiStar, FiChevronRight, FiHome, FiFilter, FiHeart } from 'react-icons/fi';

const ItemsPage = () => {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Subcategories for each main category
  const subCategories = {
    'shoes': ['All', 'Sneakers', 'Boots', 'Sandals', 'Formal'],
    'watches': ['All', 'Smart', 'Analog', 'Digital', 'Luxury'],
    'phones': ['All', 'Smartphones', 'Accessories', 'Cases'],
    'clothing': ['All', 'Men', 'Women', 'Kids']
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        const filtered = data.filter(
          product => product.category?.toLowerCase() === category.toLowerCase()
        );
        setItems(filtered);
        setFilteredItems(filtered);
        setActiveFilter('All'); // Reset filter when category changes
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => 
        item.subcategory?.toLowerCase() === filter.toLowerCase()
      );
      setFilteredItems(filtered);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    // Visual feedback
    const button = e.target.closest('button');
    if (button) {
      button.classList.add('animate-ping');
      setTimeout(() => button.classList.remove('animate-ping'), 500);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center   bg-[#222831] min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ADB5]"></div>
        <p className="mt-4 text-[#EEEEEE]">Loading {category} collection...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-[#222831]">
        <div className="mx-auto w-24 h-24 bg-[#393E46] rounded-full flex items-center justify-center mb-4">
          <FiShoppingCart className="text-[#00ADB5] text-3xl" />
        </div>
        <h3 className="text-xl font-medium text-[#EEEEEE]">No {category} available</h3>
        <p className="text-[#b5b5b5] mt-2">We're restocking soon!</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-[#00ADB5] text-[#EEEEEE] rounded-lg hover:bg-[#008E9B] transition-colors flex items-center mx-auto"
        >
          <FiHome className="mr-2" />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#222831] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Breadcrumb and Title */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-[#b5b5b5] mb-4">
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-[#00ADB5] flex items-center"
            >
              <FiHome className="mr-1" /> Home
            </button>
            <FiChevronRight className="mx-2 text-[#393E46]" />
            <span className="font-medium text-[#00ADB5] capitalize">{category}</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#EEEEEE] capitalize">
                {category} Collection
              </h1>
              <p className="text-[#b5b5b5] mt-1">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                {activeFilter !== 'All' && ` in ${activeFilter}`}
              </p>
            </div>
          </div>
        </div>

        {/* Subcategory Filters */}
        <div className="mb-8">
          <div className="flex items-center mb-3 text-[#EEEEEE]">
            <FiFilter className="mr-2 text-[#00ADB5]" />
            <span className="font-medium">Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(subCategories[category.toLowerCase()] || ['All']).map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#00ADB5] text-[#EEEEEE]'
                    : 'bg-[#393E46] text-[#b5b5b5] hover:bg-[#00ADB5]/50 hover:text-[#EEEEEE]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
  {/* Modern Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-[#393E46] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Product Image with Hover Actions */}
              <div 
                className="relative h-72 overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(item.id)}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {item.isNew && (
                    <span className="bg-[#00ADB5] text-[#EEEEEE] text-xs px-2 py-1 rounded-full shadow-md">
                      New
                    </span>
                  )}
                  {item.discount && (
                    <span className="bg-[#EEEEEE] text-[#222831] text-xs px-2 py-1 rounded-full shadow-md font-bold">
                      -{item.discount}%
                    </span>
                  )}
                </div>
                
                {/* Quick Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 bg-[#393E46]/90 rounded-full backdrop-blur-sm text-[#EEEEEE] hover:text-[#00ADB5] transition-colors">
                    <FiHeart />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 
                      className="text-lg font-semibold text-[#EEEEEE] hover:text-[#00ADB5] transition-colors cursor-pointer line-clamp-1"
                      onClick={() => handleProductClick(item.id)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-[#b5b5b5] text-xs uppercase tracking-wider">
                      {item.subcategory || item.category}
                    </p>
                  </div>
                  {item.rating && (
                    <div className="flex items-center space-x-1 bg-[#222831]/80 px-2 py-1 rounded-full text-xs">
                      <FiStar className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[#EEEEEE]">{item.rating}</span>
                    </div>
                  )}
                </div>

                {/* Price and Add to Cart */}
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold text-[#00ADB5]">
                      ${item.price  }
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-[#b5b5b5] line-through ml-2">
                        ${item.originalPrice  }
                      </span>
                    )}
                  </div>
                  <button 
                    className="p-2 bg-[#00ADB5] text-[#EEEEEE] rounded-lg hover:bg-[#008E9B] transition-colors flex items-center justify-center"
                    onClick={(e) => handleAddToCart(e, item)}
                  >
                    <FiShoppingCart className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Hover Details Panel */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#222831] to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="text-[#EEEEEE] text-sm line-clamp-2">
                  {item.description || 'Premium quality product with excellent craftsmanship.'}
                </p>
              </div>
            </div>
          ))}
        </div>
       
      </div>
    </div>
  );
};

export default ItemsPage;