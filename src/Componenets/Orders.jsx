import React, { useEffect, useState } from 'react';
import { fetchCheckout } from '../../firebaseService';
import { FiPackage, FiCheckCircle, FiClock, FiTruck, FiDollarSign, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchCheckout();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FiTruck className="text-blue-500" />;
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <FiPackage className="text-blue-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">No orders yet</h2>
        <p className="text-gray-500 mt-2">When you receive orders, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0 bg-gray-100 p-1 rounded-lg">
          {['all', 'pending', 'shipped', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FiPackage className="mx-auto text-gray-300 text-4xl mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No {activeTab} orders</h3>
          <p className="text-gray-500 mt-1">You don't have any {activeTab} orders at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900">Order #{order.id.substring(0, 8)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 text-right">
                  <p className="text-lg font-bold text-gray-900">${order.total}</p>
                  <p className="text-sm text-gray-500">{order.items?.length} items</p>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="flex items-center text-sm font-medium text-gray-900">
                    <FiUser className="mr-2 text-gray-400" />
                    Customer
                  </h3>
                  <div className="pl-6 space-y-1">
                    <p className="text-sm font-medium text-gray-900">{order.firstName} {order.lastName}</p>
                    <p className="flex items-center text-sm text-gray-500">
                      <FiMail className="mr-2" /> {order.email}
                    </p>
                    <p className="flex items-center text-sm text-gray-500">
                      <FiPhone className="mr-2" /> {order.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center text-sm font-medium text-gray-900">
                    <FiMapPin className="mr-2 text-gray-400" />
                    Shipping
                  </h3>
                  <div className="pl-6">
                    <p className="text-sm text-gray-500">{order.address}</p>
                    <p className="text-sm text-gray-500">{order.city}, {order.postalCode}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center text-sm font-medium text-gray-900">
                    <FiDollarSign className="mr-2 text-gray-400" />
                    Payment
                  </h3>
                  <div className="pl-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Method:</span>
                      <span className="font-medium capitalize">{order.paymentMethod || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal:</span>
                      <span>${order.subtotal }</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery:</span>
                      <span>${order.deliveryCharge }</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-900 pt-1 border-t border-gray-100">
                      <span>Total:</span>
                      <span>${order.total }</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center p-3 bg-white rounded-lg border border-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Category: {item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${item.price }</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  View Details
                </button>
                <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;