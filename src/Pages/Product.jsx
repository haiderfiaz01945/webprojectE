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
      <div className="product-loading-spinner">
        <div className="product-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found-container">
        <h2 className="product-not-found-title">Product Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="product-not-found-button"
        >
          <FiArrowLeft className="mr-2" />
          Back to Products
        </button>
      </div>
    );
  }

  const productImages = product.images || [product.image];

  return (
    <div className="product-page-container">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="product-back-button"
        >
          <FiArrowLeft className="mr-2" />
          Back to {product.category}
        </button>

        <div className="product-grid-container">
          <div className="product-images-section">
            <div className="product-main-image-container">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="product-main-image"
              />
            </div>

            {productImages.length > 1 && (
              <div className="product-thumbnail-gallery">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`product-thumbnail-button ${selectedImage === index ? 'product-thumbnail-button-selected' : 'product-thumbnail-button-unselected'}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="product-thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info-section">
            <div className="product-info-content">
              <h1 className="product-title">{product.name}</h1>
              
              {product.rating && (
                <div className="product-rating-container">
                  <div className="product-star-rating">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="product-rating-text">
                    {product.rating} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

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

              <div className="product-category-container">
                <p className="product-category-text">
                  <span className="product-category-label">Category:</span> {product.category}
                </p>
                {product.subcategory && (
                  <p className="product-subcategory-text">
                    <span className="product-category-label">Type:</span> {product.subcategory}
                  </p>
                )}
              </div>

              <div className="product-description-container">
                <h3 className="product-description-title">Description</h3>
                <p className="product-description-text">
                  {product.description || 'This premium product combines quality craftsmanship with modern design. Perfect for those who appreciate both style and functionality.'}
                </p>
              </div>

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

            <div className="mt-auto">
              <div className="product-shipping-info">
                <FiTruck className="product-shipping-icon" />
                <span>Free shipping on orders over $50</span>
              </div>

              <div className="product-warranty-info">
                <FiShield className="product-warranty-icon" />
                <span>1-year manufacturer warranty</span>
              </div>

              <div className="product-action-buttons">
                <button
                  onClick={handleAddToCart}
                  className="product-add-to-cart-button"
                >
                  <FiShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="product-buy-now-button"
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