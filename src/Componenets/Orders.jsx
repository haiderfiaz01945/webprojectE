import React, { useEffect, useState } from 'react';
import { fetchCheckout } from '../../firebaseService';
import { FiPackage, FiCheckCircle, FiClock, FiTruck, FiDollarSign, FiUser, FiMapPin, FiPhone, FiMail, FiChevronRight, FiHome } from 'react-icons/fi';

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

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#222831] space-y-4 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ADB5]"></div>
        <p className="text-[#EEEEEE]">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16  mx-auto bg-[#222831] min-h-screen">
        <div className="mx-auto w-24 h-24 bg-[#393E46] rounded-full flex items-center justify-center mb-4">
          <FiPackage className="text-[#00ADB5] text-3xl" />
        </div>
        <h2 className="text-2xl font-semibold text-[#EEEEEE] ">No orders yet</h2>
        <p className="text-[#b5b5b5] mt-2">When you receive orders, they'll appear here.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-2 bg-[#00ADB5] text-[#EEEEEE] rounded-lg hover:bg-[#008E9B] transition-colors flex items-center mx-auto"
        >
          <FiHome className="mr-2" />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#222831] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#EEEEEE]">Order Management</h1>
            <p className="text-[#b5b5b5] mt-1">
              Showing {filteredOrders.length} of {orders.length} orders
              {activeTab !== 'all' && ` (filtered by ${activeTab})`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {['all', 'pending', 'shipped', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[#00ADB5] text-[#EEEEEE]'
                    : 'bg-[#393E46] text-[#b5b5b5] hover:bg-[#00ADB5]/50 hover:text-[#EEEEEE]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-[#393E46] rounded-xl shadow-lg p-8 text-center border border-[#393E46]/50">
            <FiPackage className="mx-auto text-[#00ADB5] text-4xl mb-3" />
            <h3 className="text-lg font-medium text-[#EEEEEE]">No {activeTab} orders</h3>
            <p className="text-[#b5b5b5] mt-1">You don't have any {activeTab} orders at this time.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-[#393E46] rounded-xl shadow-lg overflow-hidden border border-[#393E46]/50">
                {/* Order Header */}
                <div className="p-6 border-b border-[#222831] flex flex-col sm:flex-row justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#EEEEEE]">Order #{order.id.substring(0, 8)}</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : order.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-[#b5b5b5] mt-1">
                      {formatDate(order.timestamp)}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0 text-right">
                    <p className="text-xl font-bold text-[#00ADB5]">${order.total }</p>
                    <p className="text-sm text-[#b5b5b5]">
                      {order.items?.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="flex items-center text-sm font-medium text-[#EEEEEE]">
                      <FiUser className="mr-2 text-[#00ADB5]" />
                      Customer
                    </h3>
                    <div className="pl-6 space-y-2">
                      <p className="text-sm font-medium text-[#EEEEEE]">{order.firstName} {order.lastName}</p>
                      <p className="flex items-center text-sm text-[#b5b5b5]">
                        <FiMail className="mr-2" /> {order.email}
                      </p>
                      <p className="flex items-center text-sm text-[#b5b5b5]">
                        <FiPhone className="mr-2" /> {order.phone}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-4">
                    <h3 className="flex items-center text-sm font-medium text-[#EEEEEE]">
                      <FiMapPin className="mr-2 text-[#00ADB5]" />
                      Shipping
                    </h3>
                    <div className="pl-6">
                      <p className="text-sm text-[#b5b5b5]">{order.address}</p>
                      <p className="text-sm text-[#b5b5b5]">{order.city}, {order.postalCode}</p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h3 className="flex items-center text-sm font-medium text-[#EEEEEE]">
                      <FiDollarSign className="mr-2 text-[#00ADB5]" />
                      Payment
                    </h3>
                    <div className="pl-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#b5b5b5]">Method:</span>
                        <span className="font-medium text-[#EEEEEE] capitalize">{order.paymentMethod || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#b5b5b5]">Subtotal:</span>
                        <span className="text-[#EEEEEE]">${order.subtotal }</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#b5b5b5]">Delivery:</span>
                        <span className="text-[#EEEEEE]">${order.deliveryCharge }</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-[#00ADB5] pt-2 border-t border-[#222831]">
                        <span>Total:</span>
                        <span>${order.total }</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 bg-[#222831]">
                  <h3 className="text-sm font-medium text-[#EEEEEE] mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center p-4 bg-[#393E46] rounded-lg border border-[#393E46]/50">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md border border-[#222831]"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="text-sm font-medium text-[#EEEEEE]">{item.name}</h4>
                          <p className="text-xs text-[#b5b5b5] mt-1">Category: {item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-[#EEEEEE]">${item.price }</p>
                          <p className="text-xs text-[#b5b5b5] mt-1">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 bg-[#222831] border-t border-[#393E46] flex justify-end gap-4">
                  <button className="px-4 py-2 border border-[#393E46] rounded-lg text-sm font-medium text-[#EEEEEE] hover:bg-[#393E46] transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-[#00ADB5] rounded-lg text-sm font-medium text-[#EEEEEE] hover:bg-[#008E9B] transition-colors flex items-center">
                    Update Status <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;