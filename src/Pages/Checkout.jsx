 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Componenets/CartContext';
import { addDataCheckout } from '../../firebaseService';
import { auth } from '../../firebase';
import { FiShoppingCart, FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiCreditCard, FiDollarSign, FiCheck } from 'react-icons/fi';

const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Hyderabad', 'Peshawar', 'Quetta', 'Gujranwala',
  'Sialkot', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana',
  'Sheikhupura', 'Mardan', 'Gujrat', 'Kasur', 'Rahim Yar Khan'
];

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cashOnDelivery',
    notes: ''
  });

  const deliveryCharge = 10;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmOrder = async () => {
    setShowConfirmDialog(false);
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const orderData = {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        items: cartItems,
        subtotal,
        deliveryCharge,
        total,
        status: 'pending',
        createdAt: new Date()
      };

      await addDataCheckout(orderData);
      
      setLoading(false);
      setShowThankYou(true);
      
      setTimeout(() => {
        setShowThankYou(false);
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error placing order:', error);
      setLoading(false);
      alert('There was an error placing your order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout__empty-container">
        <div className="checkout__empty-content">
          <div className="checkout__empty-icon-container">
            <FiShoppingCart className="checkout__empty-icon" />
          </div>
          <h2 className="checkout__empty-title">Your cart is empty</h2>
          <p className="checkout__empty-text">There are no items to checkout.</p>
          <button 
            onClick={() => navigate('/')}
            className="checkout__empty-button"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout__container">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="checkout__dialog-overlay">
          <div className="checkout__dialog-container">
            <h3 className="checkout__dialog-title">Confirm Your Order</h3>
            <p className="checkout__dialog-text">Are you sure you want to place this order?</p>
            <div className="checkout__dialog-buttons">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="checkout__dialog-cancel"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="checkout__dialog-confirm"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Message */}
      {showThankYou && (
        <div className="checkout__thankyou-overlay">
          <div className="checkout__thankyou-container">
            <div className="checkout__thankyou-icon-container">
              <FiCheck className="checkout__thankyou-icon" />
            </div>
            <h3 className="checkout__thankyou-title">Thank You!</h3>
            <p className="checkout__thankyou-text">Your order has been placed successfully.</p>
            <div className="checkout__thankyou-spinner-container">
              <div className="checkout__thankyou-spinner"></div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="checkout__loading-overlay">
          <div className="checkout__loading-content">
            <div className="checkout__loading-spinner"></div>
            <p className="checkout__loading-text">Processing your order...</p>
          </div>
        </div>
      )}

      <div className="checkout__inner-container">
        <h1 className="checkout__title">Checkout</h1>
        
        <div className="checkout__grid">
          {/* Shipping Information Form */}
          <div className="checkout__form-container">
            <h2 className="checkout__form-title">
              <FiUser className="checkout__form-icon" />
              Shipping Information
            </h2>
            <form onSubmit={handleCheckoutClick}>
              <div className="checkout__form-grid">
                <div>
                  <label className="checkout__form-label">First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="checkout__form-input"
                  />
                </div>
                <div>
                  <label className="checkout__form-label">Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="checkout__form-input"
                  />
                </div>
              </div>

              <div className="checkout__form-group">
                <label className="checkout__form-label">
                  <FiMail className="checkout__form-icon" />
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="checkout__form-input"
                />
              </div>

              <div className="checkout__form-group">
                <label className="checkout__form-label">
                  <FiPhone className="checkout__form-icon" />
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="checkout__form-input"
                />
              </div>

              <div className="checkout__form-group">
                <label className="checkout__form-label">
                  <FiMapPin className="checkout__form-icon" />
                  Address*
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="checkout__form-textarea"
                  rows="3"
                />
              </div>

              <div className="checkout__form-grid">
                <div>
                  <label className="checkout__form-label">City*</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="checkout__form-select"
                  >
                    <option value="" className="checkout__form-option">Select City</option>
                    {PAKISTAN_CITIES.map(city => (
                      <option key={city} value={city} className="checkout__form-option">{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="checkout__form-label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="checkout__form-input"
                  />
                </div>
              </div>

              <div className="checkout__payment-group">
                <label className="checkout__payment-label">
                  <FiCreditCard className="checkout__payment-icon" />
                  Payment Method*
                </label>
                <div className="checkout__payment-options">
                  <label className="checkout__payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cashOnDelivery"
                      checked={formData.paymentMethod === 'cashOnDelivery'}
                      onChange={handleChange}
                      className="checkout__payment-radio"
                    />
                    Cash on Delivery
                  </label>
                  <label className="checkout__payment-option-disabled">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="creditCard"
                      checked={formData.paymentMethod === 'creditCard'}
                      onChange={handleChange}
                      disabled
                      className="checkout__payment-radio"
                    />
                    Credit Card (Coming Soon)
                  </label>
                </div>
              </div>

              <div className="checkout__notes-group">
                <label className="checkout__notes-label">Order Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="checkout__notes-textarea"
                  rows="2"
                  placeholder="Any special instructions..."
                />
              </div>

              <button
                type="submit"
                className="checkout__submit-button"
              >
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout__summary-container">
            <h2 className="checkout__summary-title">
              <FiShoppingCart className="checkout__summary-icon" />
              Order Summary
            </h2>
            
            <div className="checkout__summary-divider">
              <div className="checkout__summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="checkout__summary-item">
                    <div className="checkout__item-container">
                      <div className="checkout__item-image-container">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="checkout__item-image"
                        />
                      </div>
                      <div className="checkout__item-details">
                        <h3 className="checkout__item-name">{item.name}</h3>
                        <p className="checkout__item-quantity">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="checkout__item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="checkout__summary-totals">
                <div className="checkout__total-row">
                  <span className="checkout__total-label">Subtotal</span>
                  <span className="checkout__total-value">${subtotal.toFixed(2)}</span>
                </div>
                <div className="checkout__total-row">
                  <span className="checkout__total-label">Delivery Fee</span>
                  <span className="checkout__total-value">${deliveryCharge.toFixed(2)}</span>
                </div>
              </div>

              <div className="checkout__grand-total">
                <div className="checkout__grand-total-row">
                  <span className="checkout__grand-total-label">Total</span>
                  <span className="checkout__grand-total-value">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;