import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { order, paymentId, shippingAddress } = location.state || {};

  useEffect(() => {
    // Redirect if no order data
    if (!order) {
      navigate('/shop');
      return;
    }

    // Clear cart after successful order
    clearCart();
  }, [order, navigate, clearCart]);

  if (!order) {
    return null;
  }

  // Get estimated delivery date from order (set by admin)
  const deliveryDate = order.estimatedDeliveryDate 
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment ID</p>
              <p className="text-lg font-mono text-gray-900">{paymentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="text-lg text-gray-900">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
              {deliveryDate ? (
                <p className="text-lg text-green-600 font-semibold">{deliveryDate}</p>
              ) : (
                <p className="text-sm text-orange-600 font-medium">
                  You will get to know the delivery time within 24 hours
                </p>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-8 pb-8 border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{shippingAddress.fullName}</p>
              <p className="text-gray-700 mt-1">{shippingAddress.address}</p>
              <p className="text-gray-700">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
              <p className="text-gray-700 mt-2">Phone: {shippingAddress.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ₹{item.price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
            </div>
            {order.discountApplied > 0 && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-600">Discount ({order.discountPercentage}% - {order.membershipPlan.toUpperCase()})</span>
                <span className="text-green-600 font-semibold">-₹{order.discountApplied.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700">Delivery Charges</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total Paid</span>
              <span className="text-2xl font-bold text-blue-600">₹{(order.finalPayableAmount || order.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Link
            to="/shop"
            className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg text-center flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Continue Shopping
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all duration-300 text-center flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Dashboard
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Your order will be processed and shipped within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Track your order status from the admin panel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  {deliveryDate ? (
                    <span>Expected delivery by {deliveryDate}</span>
                  ) : (
                    <span>Estimated delivery date will be confirmed within 24 hours</span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
