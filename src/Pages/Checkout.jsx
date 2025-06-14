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
  const { cartItems} = useCart();
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#222831] p-4">
        <div className="text-center max-w-md">
          <div className="mx-auto w-24 h-24 bg-[#393E46] rounded-full flex items-center justify-center mb-4">
            <FiShoppingCart className="text-[#00ADB5] text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-[#EEEEEE] mb-4">Your cart is empty</h2>
          <p className="text-[#b5b5b5] mb-6">There are no items to checkout.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#00ADB5] text-[#EEEEEE] px-6 py-3 rounded-lg hover:bg-[#008E9B] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222831] py-8 px-4 sm:px-6 relative">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#393E46] p-6 rounded-xl shadow-xl max-w-md w-full border border-[#393E46]/50">
            <h3 className="text-xl font-semibold text-[#EEEEEE] mb-4">Confirm Your Order</h3>
            <p className="mb-6 text-[#b5b5b5]">Are you sure you want to place this order?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-[#393E46] text-[#EEEEEE] rounded-lg hover:bg-[#393E46] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="px-4 py-2 bg-[#00ADB5] text-[#EEEEEE] rounded-lg hover:bg-[#008E9B] transition-colors"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Message */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#393E46] p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-[#393E46]/50">
            <div className="mx-auto w-16 h-16 bg-[#00ADB5]/10 rounded-full flex items-center justify-center mb-4">
              <FiCheck className="text-[#00ADB5] text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#EEEEEE]">Thank You!</h3>
            <p className="text-[#b5b5b5] mb-6">Your order has been placed successfully.</p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-[#00ADB5] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#00ADB5] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#EEEEEE]">Processing your order...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#EEEEEE] mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information Form */}
          <div className="bg-[#393E46] p-6 rounded-xl shadow-lg border border-[#393E46]/50">
            <h2 className="text-xl font-semibold text-[#EEEEEE] mb-6 flex items-center">
              <FiUser className="mr-2 text-[#00ADB5]" />
              Shipping Information
            </h2>
            <form onSubmit={handleCheckoutClick}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className=" text-sm font-medium text-[#EEEEEE] mb-2">First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                  />
                </div>
                <div>
                  <label className=" text-sm font-medium text-[#EEEEEE] mb-2">Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className=" text-sm font-medium text-[#EEEEEE] mb-2 flex items-center">
                  <FiMail className="mr-2 text-[#00ADB5]" />
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                />
              </div>

              <div className="mb-5">
                <label className=" text-sm font-medium text-[#EEEEEE] mb-2 flex items-center">
                  <FiPhone className="mr-2 text-[#00ADB5]" />
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                />
              </div>

              <div className="mb-5">
                <label className=" text-sm font-medium text-[#EEEEEE] mb-2 flex items-center">
                  <FiMapPin className="mr-2 text-[#00ADB5]" />
                  Address*
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className=" text-sm font-medium text-[#EEEEEE] mb-2">City*</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE]"
                  >
                    <option value="" className="bg-[#393E46]">Select City</option>
                    {PAKISTAN_CITIES.map(city => (
                      <option key={city} value={city} className="bg-[#393E46]">{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className=" text-sm font-medium text-[#EEEEEE] mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className=" text-sm font-medium text-[#EEEEEE] mb-3 flex items-center">
                  <FiCreditCard className="mr-2 text-[#00ADB5]" />
                  Payment Method*
                </label>
                <div className="space-y-3">
                  <label className="flex items-center text-[#EEEEEE]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cashOnDelivery"
                      checked={formData.paymentMethod === 'cashOnDelivery'}
                      onChange={handleChange}
                      className="mr-3 h-4 w-4 text-[#00ADB5] focus:ring-[#00ADB5] border-[#b5b5b5]"
                    />
                    Cash on Delivery
                  </label>
                  <label className="flex items-center text-[#b5b5b5]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="creditCard"
                      checked={formData.paymentMethod === 'creditCard'}
                      onChange={handleChange}
                      disabled
                      className="mr-3 h-4 w-4 text-[#00ADB5] focus:ring-[#00ADB5] border-[#b5b5b5]"
                    />
                    Credit Card (Coming Soon)
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className=" text-sm font-medium text-[#EEEEEE] mb-2">Order Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                  rows="2"
                  placeholder="Any special instructions..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00ADB5] text-[#EEEEEE] py-3 px-4 rounded-lg hover:bg-[#008E9B] transition-colors font-medium"
              >
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-[#393E46] p-6 rounded-xl shadow-lg border border-[#393E46]/50 h-fit">
            <h2 className="text-xl font-semibold text-[#EEEEEE] mb-6 flex items-center">
              <FiShoppingCart className="mr-2 text-[#00ADB5]" />
              Order Summary
            </h2>
            
            <div className="divide-y divide-[#222831]">
              <div className="py-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-[#222831] bg-[#222831]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-[#EEEEEE]">{item.name}</h3>
                        <p className="text-xs text-[#b5b5b5]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-[#EEEEEE]">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="py-4">
                <div className="flex justify-between py-2">
                  <span className="text-[#b5b5b5]">Subtotal</span>
                  <span className="text-[#EEEEEE]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#b5b5b5]">Delivery Fee</span>
                  <span className="text-[#EEEEEE]">${deliveryCharge.toFixed(2)}</span>
                </div>
              </div>

              <div className="py-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-[#EEEEEE]">Total</span>
                  <span className="font-bold text-xl text-[#00ADB5]">${total.toFixed(2)}</span>
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