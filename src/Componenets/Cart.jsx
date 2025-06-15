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
      <div className="flex justify-center items-center min-h-screen bg-[#222831]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-[#00ADB5] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#EEEEEE]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#222831]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-[#00ADB5] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#EEEEEE]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222831] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#00ADB5] hover:text-[#008E9B] transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-[#EEEEEE]">Your Shopping Cart</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-[#393E46] rounded-xl">
            <div className="mx-auto w-24 h-24 bg-[#222831] rounded-full flex items-center justify-center mb-4">
              <FiShoppingCart className="text-[#00ADB5] text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-[#EEEEEE]">Your cart is empty</h3>
            <p className="text-[#b5b5b5] mt-4">
              <Link 
                to="/" 
                className="text-[#00ADB5] hover:underline font-medium"
              >
                Discover our products
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#393E46] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-[#222831]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-[#EEEEEE]">{item.name}</h3>
                          <p className="text-[#b5b5b5] text-sm capitalize">{item.category}</p>
                        </div>
                        <p className="text-lg font-semibold text-[#00ADB5]">${item.price}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityUpdate(item, -1)}
                            disabled={loadingQuantityIds.includes(item.id) || loadingRemoveIds.includes(item.id)}
                            className={`p-2 rounded-l-lg ${
                              loadingQuantityIds.includes(item.id) 
                                ? 'bg-[#222831] text-[#b5b5b5]' 
                                : 'bg-[#222831] hover:bg-[#00ADB5] text-[#EEEEEE]'
                            } transition-colors`}
                          >
                            <FiMinus />
                          </button>
                          <span className="px-4 py-2 bg-[#222831] text-[#EEEEEE]">
                            {loadingQuantityIds.includes(item.id) ? (
                              <span className="inline-block h-4 w-4 border-2 border-[#00ADB5] border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(item, 1)}
                            disabled={loadingQuantityIds.includes(item.id) || loadingRemoveIds.includes(item.id)}
                            className={`p-2 rounded-r-lg ${
                              loadingQuantityIds.includes(item.id) 
                                ? 'bg-[#222831] text-[#b5b5b5]' 
                                : 'bg-[#222831] hover:bg-[#00ADB5] text-[#EEEEEE]'
                            } transition-colors`}
                          >
                            <FiPlus />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={loadingRemoveIds.includes(item.id) || loadingQuantityIds.includes(item.id)}
                          className={`flex items-center px-3 py-2 rounded-lg ${
                            loadingRemoveIds.includes(item.id)
                              ? 'bg-[#222831] text-[#b5b5b5]'
                              : 'bg-[#222831] hover:bg-red-500 text-[#EEEEEE]'
                          } transition-colors`}
                        >
                          {loadingRemoveIds.includes(item.id) ? (
                            <>
                              <span className="inline-block h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                              Removing
                            </>
                          ) : (
                            <>
                              <FiTrash2 className="mr-2" />
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
            <div className="lg:col-span-1">
              <div className="bg-[#393E46] rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-[#EEEEEE] mb-6 pb-2 border-b border-[#222831]">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#b5b5b5]">Items ({calculateItemCount()}):</span>
                    <span className="text-[#EEEEEE] font-medium">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#b5b5b5]">Shipping:</span>
                    <span className="text-[#EEEEEE] font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#b5b5b5]">Tax:</span>
                    <span className="text-[#EEEEEE] font-medium">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="py-4 border-t border-b border-[#222831] mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#EEEEEE]">Total</span>
                    <span className="text-2xl font-bold text-[#00ADB5]">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center ${
                    cartItems.length === 0 || isProcessing
                      ? 'bg-[#393E46] text-[#b5b5b5] cursor-not-allowed'
                      : 'bg-[#00ADB5] hover:bg-[#008E9B] text-[#EEEEEE]'
                  }`}
                  disabled={cartItems.length === 0 || isProcessing}
                  onClick={() => navigate('/checkout')}
                >
                  {isProcessing ? (
                    <>
                      <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </button>
                
                <div className="mt-4 flex items-center text-[#b5b5b5] text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Express checkout available</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;