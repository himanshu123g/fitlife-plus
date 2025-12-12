import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadOrders();
    setTimeout(() => setIsVisible(true), 100);

    // Set up real-time updates - refresh every 30 seconds
    const interval = setInterval(() => {
      loadOrders();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [navigate]);

  const loadOrders = async () => {
    try {
      const res = await API.get('/orders/my-orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Failed':
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const normalizePaymentStatus = (status) => {
    if (status === 'completed') return 'Paid';
    if (status === 'pending') return 'Pending';
    if (status === 'failed') return 'Failed';
    return status;
  };

  const getDeliveryIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Shipped':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'Out for Delivery':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        );
      case 'Delivered':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Cancelled':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className={`mb-8 text-center transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ border: 'none', outline: 'none' }}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Order History</h1>
          <div className="flex justify-center mb-4">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all duration-1000 ease-out animate-expandWidth"></div>
          </div>
          <p className="text-gray-600 mb-6">View and track all your supplement orders</p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping for supplements!</p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
            >
              Browse Supplements
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">Order #{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {normalizePaymentStatus(order.paymentStatus)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.orderTimestamp || order.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getDeliveryStatusColor(order.deliveryStatus)}`}>
                      {getDeliveryIcon(order.deliveryStatus)}
                      <span className="font-semibold">{order.deliveryStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  {/* Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Items ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-12 h-12 object-contain rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                            {item.brand && <p className="text-xs text-gray-500">{item.brand}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">₹{item.totalPrice || (item.price * item.quantity)}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Estimated Delivery / Cancellation Notice */}
                  {order.deliveryStatus === 'Cancelled' ? (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-600">Order Status</p>
                          <p className="text-sm font-semibold text-red-700">
                            Order Cancelled - Refund will be processed within 5-7 business days
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : order.estimatedDeliveryDate ? (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-600">Estimated Delivery</p>
                          <p className="text-sm font-semibold text-blue-700">
                            {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : order.deliveryStatus === 'Order Placed' && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-orange-700">
                          You will get to know the delivery time within 24 hours
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-semibold text-gray-900">₹{order.totalAmount}</span>
                    </div>
                    {order.discountApplied > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">
                            Discount ({order.discountPercentage}% - {order.membershipPlan.toUpperCase()})
                          </span>
                          <span className="font-semibold text-green-600">-₹{order.discountApplied}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                          <span className="text-gray-900">Final Amount Paid</span>
                          <span className="text-blue-600">₹{order.finalPayableAmount}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/order-details/${order._id}`}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-center"
                    >
                      View Order Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 80px; }
        }
        .animate-expandWidth {
          animation: expandWidth 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
