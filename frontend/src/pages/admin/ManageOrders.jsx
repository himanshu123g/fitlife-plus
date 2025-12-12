import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState('');

  useEffect(() => {
    loadOrders();
    // Poll for updates every 10 seconds
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [filterPaymentStatus, filterDeliveryStatus, searchTerm]);

  const loadOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filterPaymentStatus) params.append('paymentStatus', filterPaymentStatus);
      if (filterDeliveryStatus) params.append('deliveryStatus', filterDeliveryStatus);
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await API.get(`/orders/admin/all?${params.toString()}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      console.error('Error details:', err.response?.data);
      if (err.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as admin.');
      } else {
        alert('Failed to load orders. Please check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId, deliveryStatus) => {
    try {
      await API.patch(`/orders/admin/${orderId}/delivery-status`, { deliveryStatus });
      alert('Delivery status updated successfully');
      loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, deliveryStatus });
      }
    } catch (err) {
      console.error('Error updating delivery status:', err);
      alert('Failed to update delivery status');
    }
  };

  const updateEstimatedDelivery = async (orderId, estimatedDeliveryDate) => {
    try {
      await API.patch(`/orders/admin/${orderId}/estimated-delivery`, { estimatedDeliveryDate });
      alert('Estimated delivery date updated successfully');
      loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, estimatedDeliveryDate });
      }
    } catch (err) {
      console.error('Error updating estimated delivery date:', err);
      alert('Failed to update estimated delivery date');
    }
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`⚠️ Permanently delete order ${orderNumber}?\n\nThis action cannot be undone!`)) return;
    
    try {
      await API.delete(`/admin/orders/${orderId}`);
      alert('Order deleted successfully!');
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(null);
      }
      loadOrders();
    } catch (err) {
      console.error('Delete order error:', err);
      alert(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-700';
      case 'Shipped':
        return 'bg-purple-100 text-purple-700';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
      case 'completed': // Old orders use 'completed'
        return 'bg-green-100 text-green-700';
      case 'Pending':
      case 'pending': // Old orders use lowercase
        return 'bg-yellow-100 text-yellow-700';
      case 'Failed':
      case 'failed': // Old orders use lowercase
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const normalizePaymentStatus = (status) => {
    // Normalize old status values to new ones for display
    if (status === 'completed') return 'Paid';
    if (status === 'pending') return 'Pending';
    if (status === 'failed') return 'Failed';
    return status;
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm && !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Order</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Order number..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
              <select
                value={filterDeliveryStatus}
                onChange={(e) => setFilterDeliveryStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterPaymentStatus('');
                  setFilterDeliveryStatus('');
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.deliveryStatus === 'Order Placed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter(o => o.deliveryStatus === 'Shipped' || o.deliveryStatus === 'Out for Delivery').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.deliveryStatus === 'Delivered').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Order #</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Delivery</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{order.user?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.orderTimestamp || order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">₹{order.finalPayableAmount || order.totalAmount}</p>
                          {order.discountApplied > 0 && (
                            <p className="text-xs text-green-600">-₹{order.discountApplied} ({order.discountPercentage}%)</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {normalizePaymentStatus(order.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.deliveryStatus}
                          onChange={(e) => updateDeliveryStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 ${getDeliveryStatusColor(order.deliveryStatus)} cursor-pointer`}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id, order.orderNumber)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                            title="Delete order"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto flex-1">
                <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedOrder.orderTimestamp || selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.user?.name}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Membership</p>
                    <p className="font-semibold text-gray-900 capitalize">{selectedOrder.membershipPlan}</p>
                  </div>
                </div>

                {/* Set Estimated Delivery Date */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Set Estimated Delivery Date</h4>
                  <div className="flex gap-3">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      defaultValue={selectedOrder.estimatedDeliveryDate ? new Date(selectedOrder.estimatedDeliveryDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          updateEstimatedDelivery(selectedOrder._id, e.target.value);
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {selectedOrder.estimatedDeliveryDate && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">
                          {new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  {!selectedOrder.estimatedDeliveryDate && (
                    <p className="text-xs text-gray-600 mt-2">
                      Customer will see: "You will get to know the delivery time within 24 hours"
                    </p>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-contain rounded" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                          <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="font-semibold text-gray-900">₹{item.totalPrice || (item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">₹{selectedOrder.totalAmount}</span>
                    </div>
                    {selectedOrder.discountApplied > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({selectedOrder.discountPercentage}%)</span>
                        <span className="font-semibold">-₹{selectedOrder.discountApplied}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total Paid</span>
                      <span className="text-blue-600">₹{selectedOrder.finalPayableAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                      </p>
                      <p className="text-sm text-gray-600">Phone: {selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    {selectedOrder.paymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID</span>
                        <span className="font-mono text-sm">{selectedOrder.paymentId}</span>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
