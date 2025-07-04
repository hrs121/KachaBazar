"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { sellerAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const SellerOrders = () => {
  const { user } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [activeTab, setActiveTab] = useState('sales'); // 'sales' or 'purchases'

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.category !== 'seller') {
      router.push('/home');
      return;
    }

    fetchOrders();
  }, [user, router, activeTab]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = activeTab === 'sales' 
        ? await sellerAPI.getSellerOrders({ page, limit: 10 })
        : await sellerAPI.getPurchaseHistory({ page, limit: 10 });
      
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || user.category !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Seller only.</p>
          <Link href="/home" className="text-green-600 hover:text-green-700 mt-2 inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/seller/dashboard" className="flex items-center">
                <img src="/img/kachabazar_icon.png" alt="KachaBazar" className="w-10 h-10" />
                <span className="text-xl font-bold text-green-600 ml-2">KachaBazar</span>
              </Link>
              <span className="ml-4 text-gray-500">|</span>
              <span className="ml-4 text-lg font-semibold text-gray-700">Orders</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/seller/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sales'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sales Orders
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  Products you've sold
                </span>
              </button>
              <button
                onClick={() => setActiveTab('purchases')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'purchases'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Purchase History
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  Products you've bought
                </span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'sales' ? 'Sales Orders' : 'Purchase History'}
            </h1>
            <p className="text-gray-600 mb-6">
              {activeTab === 'sales' 
                ? 'Orders containing products you\'ve sold'
                : 'Orders you\'ve placed as a customer'
              }
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg mb-4">
                  {activeTab === 'sales' ? 'No sales orders found' : 'No purchase history found'}
                </p>
                <p className="text-gray-400">
                  {activeTab === 'sales' 
                    ? 'Your sales orders will appear here when customers purchase your products'
                    : 'Your purchase history will appear here when you buy products'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} item(s)
                        </p>
                      </div>
                    </div>

                    {activeTab === 'sales' && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Customer:</span> {order.user.firstName} {order.user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {order.user.email}
                        </p>
                        {order.user.phoneNumber && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {order.user.phoneNumber}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0">
                                <img
                                  src={item.product?.image || '/img/product/default-product.jpg'}
                                  alt={item.product?.title || 'Product'}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.product?.title || item.productTitle}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatCurrency(item.price)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.shippingAddress && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address:</h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                          <p>{order.shippingAddress.country}</p>
                          <p>Phone: {order.shippingAddress.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
                </div>
                <div className="flex space-x-2">
                  {pagination.page > 1 && (
                    <button
                      onClick={() => fetchOrders(pagination.page - 1)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Previous
                    </button>
                  )}
                  {pagination.page < pagination.pages && (
                    <button
                      onClick={() => fetchOrders(pagination.page + 1)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
