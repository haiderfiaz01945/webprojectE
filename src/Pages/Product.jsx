import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../firebaseService';
import { useCart } from '../Componenets/CartContext';
import { FiShoppingCart, FiArrowLeft, FiStar, FiTruck, FiShield } from 'react-icons/fi';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProducts();
        const foundProduct = data.find((p) => p.id === id);
        setProduct(foundProduct || null);
        if (foundProduct?.images) {
          setSelectedImage(0);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images ? product.images[0] : product.image,
        category: product.category,
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="product-loading-container">
        <div className="product-loading-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-notfound-container">
        <h2 className="product-notfound-title">Product Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="product-notfound-btn"
        >
          <FiArrowLeft className="product-notfound-icon" />
          Back to Products
        </button>
      </div>
    );
  }

  const productImages = product.images || [product.image];

  return (
    <div className="product-page-container">
      <div className="product-page-inner">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="product-back-btn"
        >
          <FiArrowLeft className="product-back-icon" />
          Back to. {product.category}
        </button>

        {/* Product Container */}
        <div className="product-detail-grid">
          {/* Product Images */}
          <div className="product-image-section">
            {/* Main Image */}
            <div className="product-main-image-container">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="product-main-image"
              />
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="product-thumbnail-grid">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`product-thumbnail-btn ${selectedImage === index ? 'active' : 'inactive'}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="product-thumbnail-img"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-info-content">
              <h1 className="product-title">{product.name}</h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="product-rating-container">
                  <div className="product-rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`product-rating-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="product-rating-text">
                    {product.rating} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="product-price-container">
                <span className="product-current-price">${product.price}</span>
                {product.originalPrice && (
                  <span className="product-original-price">${product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="product-discount-badge">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Category Info */}
              <div className="product-category-info">
                <p className="product-category-text">
                  <span className="product-category-label">Category:</span> {product.category}
                </p>
                {product.subcategory && (
                  <p className="product-category-text">
                    <span className="product-category-label">Type:</span> {product.subcategory}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="product-description-container">
                <h3 className="product-description-title">Description</h3>
                <p className="product-description-text">
                  {product.description || 'This premium product combines quality craftsmanship with modern design. Perfect for those who appreciate both style and functionality.'}
                </p>
              </div>

              {/* Features */}
              {product.features && (
                <div className="product-features-container">
                  <h3 className="product-features-title">Key Features</h3>
                  <ul className="product-features-list">
                    {product.features.map((feature, index) => (
                      <li key={index} className="product-feature-item">
                        <span className="product-feature-bullet">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Buttons and Info */}
            <div className="product-actions-container">
              {/* Shipping Info */}
              <div className="product-shipping-info">
                <FiTruck className="product-shipping-icon" />
                <span>Free shipping on orders over $50</span>
              </div>

              {/* Warranty Info */}
              <div className="product-warranty-info">
                <FiShield className="product-warranty-icon" />
                <span>1-year manufacturer warranty</span>
              </div>

              {/* Action Buttons */}
              <div className="product-action-btns">
                <button
                  onClick={handleAddToCart}
                  className="product-cart-btn"
                >
                  <FiShoppingCart className="product-cart-icon" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="product-buy-btn"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;