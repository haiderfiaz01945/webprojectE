import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProducts } from '../../firebaseService';
import { useCart } from '../Componenets/CartContext';
import { FiShoppingCart, FiStar, FiChevronRight, FiHome, FiFilter, FiHeart } from 'react-icons/fi';
import "../App.css"
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading {category} collection...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-container">
          <FiShoppingCart className="empty-icon" />
        </div>
        <h3 className="empty-title">No {category} available</h3>
        <p className="empty-text">We're restocking soon!</p>
        <button 
          onClick={() => navigate('/')}
          className="empty-button"
        >
          <FiHome className="empty-button-icon" />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="items-container">
      <div className="items-inner-container">
        {/* Breadcrumb and Title */}
        <div className="mb-8">
          <nav className="breadcrumb">
            <button 
              onClick={() => navigate('/')} 
              className="breadcrumb-button"
            >
              <FiHome className="breadcrumb-icon" /> Home
            </button>
            <FiChevronRight className="breadcrumb-separator" />
            <span className="breadcrumb-current">{category}</span>
          </nav>
          
          <div className="page-header">
            <div>
              <h1 className="page-title">
                {category} Collection
              </h1>
              <p className="page-subtitle">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                {activeFilter !== 'All' && ` in ${activeFilter}`}
              </p>
            </div>
          </div>
        </div>

        {/* Subcategory Filters */}
        <div className="filter-section">
          <div className="filter-header">
            <FiFilter className="filter-icon" />
            <span className="filter-title">Filter by:</span>
          </div>
          <div className="filter-buttons">
            {(subCategories[category.toLowerCase()] || ['All']).map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`filter-button ${
                  activeFilter === filter ? 'filter-button-active' : 'filter-button-inactive'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Modern Product Grid */}
        <div className="product-grid">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="product-card"
            >
              {/* Product Image with Hover Actions */}
              <div 
                className="product-image-container"
                onClick={() => handleProductClick(item.id)}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="product-image"
                />
                
                {/* Badges */}
                <div className="product-badges">
                  {item.isNew && (
                    <span className="product-badge badge-new">
                      New
                    </span>
                  )}
                  {item.discount && (
                    <span className="product-badge badge-discount">
                      -{item.discount}%
                    </span>
                  )}
                </div>
                
                {/* Quick Actions */}
                <div className="quick-actions">
                  <button className="wishlist-button">
                    <FiHeart />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="product-header">
                  <div>
                    <h3 
                      className="product-name"
                      onClick={() => handleProductClick(item.id)}
                    >
                      {item.name}
                    </h3>
                    <p className="product-category">
                      {item.subcategory || item.category}
                    </p>
                  </div>
                  {item.rating && (
                    <div className="product-rating">
                      <FiStar className="rating-icon" />
                      <span className="rating-value">{item.rating}</span>
                    </div>
                  )}
                </div>

                {/* Price and Add to Cart */}
                <div className="product-footer">
                  <div>
                    <span className="product-price">
                      ${item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="original-price">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>
                  <button 
                    className="add-to-cart"
                    onClick={(e) => handleAddToCart(e, item)}
                  >
                    <FiShoppingCart className="cart-icon" />
                  </button>
                </div>
              </div>

              {/* Hover Details Panel */}
              <div className="hover-details">
                <p className="product-description">
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