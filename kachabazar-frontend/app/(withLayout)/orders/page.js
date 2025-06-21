"use client";

import Header from '@/Components/Header';
import { useUser } from '@/context/UserContext';
import { formatCurrency } from '@/lib/utils';
import { ordersAPI } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const { user } = useUser();
    const router = useRouter();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await ordersAPI.getMyOrders();
            setOrders(response.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null; // Will redirect to login
    }

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

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(order => order.status?.toLowerCase() === filter);

    return (
        <div>
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded transition-colors"
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                                        filter === status
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {status === 'all' ? 'All Orders' : status}
                                    {status !== 'all' && (
                                        <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                            {orders.filter(order => order.status?.toLowerCase() === status).length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa fa-shopping-bag text-2xl text-gray-400"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {filter === 'all' 
                                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                                : `You don't have any ${filter} orders at the moment.`
                            }
                        </p>
                        {filter === 'all' && (
                            <Link
                                href="/home"
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                            >
                                Start Shopping
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                {/* Order Header */}
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                                                {order.status || 'pending'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                {formatCurrency(order.totalAmount)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            {order.items && order.items.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {order.items.slice(0, 3).map((item, index) => (
                                                        <span key={index} className="text-sm text-gray-600">
                                                            {item.product?.title || 'Product'} (x{item.quantity})
                                                            {index < Math.min(order.items.length, 3) - 1 && ', '}
                                                        </span>
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <span className="text-sm text-gray-500">
                                                            +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">No items</span>
                                            )}
                                        </div>
                                        <Link
                                            href={`/orders/${order._id}?id=${order._id}`}
                                            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Progress (for active orders) */}
                                {order.status && ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status.toLowerCase()) && (
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full ${order.status ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className="ml-2 text-gray-600">Order Placed</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full ${['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status?.toLowerCase()) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className="ml-2 text-gray-600">Confirmed</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status?.toLowerCase()) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className="ml-2 text-gray-600">Processing</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full ${['shipped', 'delivered'].includes(order.status?.toLowerCase()) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className="ml-2 text-gray-600">Shipped</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full ${order.status?.toLowerCase() === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className="ml-2 text-gray-600">Delivered</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                {!loading && orders.length > 0 && (
                    <div className="mt-8 bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/home"
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/contact"
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
