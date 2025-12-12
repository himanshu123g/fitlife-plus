import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../api';

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadOrder();

    // Set up real-time updates - refresh every 30 seconds
    const interval = setInterval(() => {
      loadOrder();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [id, navigate]);

  const loadOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error('Error loading order:', err);
      if (err.response?.status === 404) {
        navigate('/order-history');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDeliverySteps = () => {
    // If order is cancelled, return cancelled state
    if (order?.deliveryStatus === 'Cancelled') {
      return [
        { name: 'Order Placed', icon: '📦', completed: true, current: false },
        { name: 'Cancelled', icon: '❌', completed: true, current: true, cancelled: true }
      ];
    }

    const steps = [
      { name: 'Order Placed', icon: '📦' },
      { name: 'Shipped', icon: '🚚' },
      { name: 'Out for Delivery', icon: '🛵' },
      { name: 'Delivered', icon: '✅' }
    ];

    const currentIndex = steps.findIndex(s => s.name === order?.deliveryStatus);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link to="/order-history" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Order History
          </Link>
        </div>
      </div>
    );
  }

  const deliverySteps = getDeliverySteps();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Order Details</h1>
          <div className="flex justify-center mb-4">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all duration-1000 ease-out animate-expandWidth"></div>
          </div>
          <Link
            to="/order-history"
            className="inline-block px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
          >
            Back to Orders
          </Link>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Order Number</h3>
              <p className="text-xl font-bold text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Order Date</h3>
              <p className="text-lg text-gray-900">
                {new Date(order.orderTimestamp || order.createdAt).toLocaleString('en-US', {
                  dateStyle: 'long',
                  timeStyle: 'short'
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Payment Status</h3>
              <span className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                (order.paymentStatus === 'Paid' || order.paymentStatus === 'completed') ? 'bg-green-100 text-green-700' :
                (order.paymentStatus === 'Pending' || order.paymentStatus === 'pending') ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {order.paymentStatus === 'completed' ? 'Paid' : 
                 order.paymentStatus === 'pending' ? 'Pending' : 
                 order.paymentStatus === 'failed' ? 'Failed' : 
                 order.paymentStatus}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Payment Method</h3>
              <p className="text-lg text-gray-900">{order.paymentMethod}</p>
            </div>
            {order.paymentId && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Transaction ID</h3>
                <p className="text-sm text-gray-700 font-mono bg-gray-50 px-3 py-2 rounded">{order.paymentId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Status Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {order.deliveryStatus === 'Cancelled' ? 'Order Status' : 'Delivery Status'}
            </h3>
            {order.deliveryStatus === 'Cancelled' ? (
              <div className="text-right">
                <p className="text-sm text-gray-600">Order Cancelled</p>
                <p className="text-lg font-semibold text-red-600">
                  {new Date(order.updatedAt || order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            ) : order.estimatedDeliveryDate ? (
              <div className="text-right">
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="text-lg font-semibold text-blue-600">
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="text-sm font-medium text-orange-600">
                  You will get to know the delivery time within 24 hours
                </p>
              </div>
            )}
          </div>

          {/* Cancelled Order Display */}
          {order.deliveryStatus === 'Cancelled' ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-red-600 mb-2">Order Cancelled</h4>
              <p className="text-gray-600 mb-4">
                This order has been cancelled and will not be delivered.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-red-700">
                  <strong>What happens next?</strong><br/>
                  • Your payment will be refunded within 5-7 business days<br/>
                  • You will receive a refund confirmation email<br/>
                  • Contact support if you have any questions
                </p>
              </div>
            </div>
          ) : (
            /* Normal Delivery Timeline */
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${(deliverySteps.findIndex(s => s.current) / (deliverySteps.length - 1)) * 100}%`
                  }}
                ></div>
              </div>

              {/* Steps */}
              <div className="relative grid grid-cols-4 gap-4">
                {deliverySteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all duration-300 ${
                      step.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                    } ${step.current ? 'ring-4 ring-blue-200 scale-110' : ''}`}>
                      {step.completed ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                    <p className={`text-xs text-center font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {item.productImage && (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-20 object-contain rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                  {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                  <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">₹{item.price} each</p>
                  <p className="text-lg font-bold text-gray-900">₹{item.totalPrice || (item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">₹{order.totalAmount}</span>
            </div>
            {order.discountApplied > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({order.discountPercentage}% - {order.membershipPlan.toUpperCase()} Member)</span>
                <span className="font-semibold">-₹{order.discountApplied}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total Paid</span>
              <span className="text-blue-600">₹{order.finalPayableAmount}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
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
