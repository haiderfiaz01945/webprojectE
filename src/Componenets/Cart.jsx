import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiCheck } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();
  const [loadingRemoveIds, setLoadingRemoveIds] = useState([]);
  const [loadingQuantityIds, setLoadingQuantityIds] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
      if (!currentUser) {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const handleQuantityUpdate = async (item, amount) => {
    if (!user) return;
    
    const newQty = item.quantity + amount;
    if (newQty < 1) return;

    setLoadingQuantityIds((prev) => [...prev, item.id]);
    try {
      await updateQuantity(item.id, amount);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoadingQuantityIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const handleRemove = async (id) => {
    if (!user) return;
    
    setLoadingRemoveIds((prev) => [...prev, id]);
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoadingRemoveIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const isProcessing = loadingRemoveIds.length > 0 || loadingQuantityIds.length > 0;

  if (authChecking) {
    return (
      <div className="cart-loading-container">
        <div className="cart-loading-spinner"></div>
        <p className="cart-loading-text">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="cart-loading-container">
        <div className="cart-loading-spinner"></div>
        <p className="cart-loading-text">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-inner-container">
        {/* Header */}
        <div className="cart-header">
          <button
            onClick={() => navigate(-1)}
            className="cart-back-button"
          >
            <FiArrowLeft className="cart-back-icon" />
            Continue Shopping
          </button>
          <h1 className="cart-title">Your Shopping Cart</h1>
          <div className="cart-header-spacer"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <div className="cart-empty-icon-container">
              <FiShoppingCart className="cart-empty-icon" />
            </div>
            <h3 className="cart-empty-text">Your cart is empty</h3>
            <p className="cart-empty-message">
              <Link 
                to="/" 
                className="cart-empty-link"
              >
                Discover our products
              </Link>
            </p>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Cart Items */}
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="cart-item-card"
                >
                  <div className="cart-item-content">
                    {/* Product Image */}
                    <div className="cart-item-image-container">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <div>
                          <h3 className="cart-item-name">{item.name}</h3>
                          <p className="cart-item-category">{item.category}</p>
                        </div>
                        <p className="cart-item-price">${item.price}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="cart-item-controls">
                        <div className="cart-quantity-control">
                          <button
                            onClick={() => handleQuantityUpdate(item, -1)}
                            disabled={loadingQuantityIds.includes(item.id) || loadingRemoveIds.includes(item.id)}
                            className="cart-quantity-button"
                          >
                            <FiMinus />
                          </button>
                          <span className="cart-quantity-display">
                            {loadingQuantityIds.includes(item.id) ? (
                              <span className="cart-loading-spinner"></span>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(item, 1)}
                            disabled={loadingQuantityIds.includes(item.id) || loadingRemoveIds.includes(item.id)}
                            className="cart-quantity-button"
                          >
                            <FiPlus />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={loadingRemoveIds.includes(item.id) || loadingQuantityIds.includes(item.id)}
                          className="cart-remove-button"
                        >
                          {loadingRemoveIds.includes(item.id) ? (
                            <span className="cart-processing-text">
                              <span className="cart-loading-spinner"></span>
                              Removing
                            </span>
                          ) : (
                            <>
                              <FiTrash2 className="cart-remove-icon" />
                              Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <h2 className="cart-summary-title">
                Order Summary
              </h2>
              
              <div className="cart-summary-details">
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Items ({calculateItemCount()}):</span>
                  <span className="cart-summary-value">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Shipping:</span>
                  <span className="cart-summary-value">FREE</span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Tax:</span>
                  <span className="cart-summary-value">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="cart-summary-total">
                <div className="cart-summary-row">
                  <span className="cart-summary-total-label">Total</span>
                  <span className="cart-summary-total-value">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button
                className="cart-checkout-button"
                disabled={cartItems.length === 0 || isProcessing}
                onClick={() => navigate('/checkout')}
              >
                {isProcessing ? (
                  <span className="cart-processing-text">
                    <span className="cart-loading-spinner"></span>
                    Processing...
                  </span>
                ) : (
                  <>
                    <FiCheck className="cart-checkout-icon" />
                    Proceed to Checkout
                  </>
                )}
              </button>
              
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;