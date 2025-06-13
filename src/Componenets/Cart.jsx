// cart.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { auth } from '../../firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();
  const [loadingRemoveIds, setLoadingRemoveIds] = useState([]);
  const [loadingQuantityIds, setLoadingQuantityIds] = useState([]);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
      if (!currentUser) {
        navigate('/login', { state: { from: '/cart' } });
      }
    });
    return unsubscribe;
  }, [navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
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

  // Show loading state while checking auth status
  if (authChecking) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated (will redirect but show this briefly)
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">Your cart is empty</h3>
          <p className="text-gray-500 mt-2">
            <Link to="/" className="text-blue-600 hover:underline">Continue shopping</Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 flex">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                          <p className="text-gray-500 text-sm">{item.category}</p>
                        </div>
                        <p className="text-lg font-medium text-gray-900">${item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityUpdate(item, -1)}
                            disabled={loadingQuantityIds.includes(item.id) || loadingRemoveIds.includes(item.id)}
                            className="px-2 py-1 border border-gray-300 rounded-l-md disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-t border-b border-gray-300">
                            {loadingQuantityIds.includes(item.id) ? (
                              <span className="inline-block h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(item, 1)}
                            disabled={loadingQuantityIds.includes(item.id) || loadingRemoveIds.includes(item.id)}
                            className="px-2 py-1 border border-gray-300 rounded-r-md disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={loadingRemoveIds.includes(item.id) || loadingQuantityIds.includes(item.id)}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center"
                        >
                          {loadingRemoveIds.includes(item.id) ? (
                            <>
                              <span className="inline-block h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                              Removing
                            </>
                          ) : (
                            'Remove'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="divide-y divide-gray-200">
                <div className="py-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-xl font-bold">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={cartItems.length === 0 || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;