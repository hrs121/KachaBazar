"use client";

import Header from '@/Components/Header';
import { useUser } from '@/context/UserContext';
import { formatCurrency } from '@/lib/utils';
import { ordersAPI } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const OrderSuccess = () => {
    const { user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        
        if (orderId) {
            fetchOrder();
        } else {
            router.push('/home');
        }
    }, [user, orderId]);    const fetchOrder = async () => {
        try {
            const response = await ordersAPI.getOrder(orderId);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order:', error);
            router.push('/home');
        } finally {
            setLoading(false);
        }
    };    const getStatusColor = (status) => {
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

    const getStepStatus = (currentStatus, stepKey) => {
        const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(currentStatus?.toLowerCase());
        const stepIndex = statusOrder.indexOf(stepKey);
        return currentIndex >= stepIndex;
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div>
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div>
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Order not found</h1>
                    <button
                        onClick={() => router.push('/home')}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Success Message */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fa fa-check text-3xl text-green-600"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                    <p className="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
                </div>                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                                {order.status || 'pending'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
                                <dl className="space-y-1 text-sm">
                                    <div className="flex">
                                        <dt className="font-medium text-gray-600 w-32">Order Number:</dt>
                                        <dd className="text-gray-900">{order.orderNumber}</dd>
                                    </div>
                                    <div className="flex">
                                        <dt className="font-medium text-gray-600 w-32">Order Date:</dt>
                                        <dd className="text-gray-900">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    <div className="flex">
                                        <dt className="font-medium text-gray-600 w-32">Status:</dt>
                                        <dd className="text-gray-900 capitalize">{order.status}</dd>
                                    </div>
                                    <div className="flex">
                                        <dt className="font-medium text-gray-600 w-32">Payment:</dt>
                                        <dd className="text-gray-900 capitalize">{order.paymentMethod}</dd>
                                    </div>
                                </dl>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                    </p>
                                    <p>{order.shippingAddress.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
                            <div className="space-y-4">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                                {item.product?.title || 'Product'}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity} × {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>                        </div>

                        {/* Order Tracking Progress */}
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h3 className="font-medium text-gray-900 mb-4">Order Progress</h3>
                            <div className="space-y-4">
                                {[
                                    { key: 'pending', label: 'Order Placed', icon: 'fa-shopping-cart' },
                                    { key: 'confirmed', label: 'Order Confirmed', icon: 'fa-check-circle' },
                                    { key: 'processing', label: 'Processing', icon: 'fa-cog' },
                                    { key: 'shipped', label: 'Shipped', icon: 'fa-truck' },
                                    { key: 'delivered', label: 'Delivered', icon: 'fa-home' }
                                ].map((step, index) => {
                                    const isCompleted = getStepStatus(order.status, step.key);
                                    const isCurrent = order.status?.toLowerCase() === step.key;
                                    
                                    return (
                                        <div key={step.key} className="flex items-center">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                                isCompleted 
                                                    ? 'bg-green-500 text-white' 
                                                    : isCurrent 
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-300 text-gray-600'
                                            }`}>
                                                <i className={`fa ${step.icon} text-sm`}></i>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <p className={`text-sm font-medium ${
                                                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                                                }`}>
                                                    {step.label}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-xs text-blue-600">Current status</p>
                                                )}
                                            </div>
                                            {index < 4 && (
                                                <div className={`w-full h-px ml-4 ${
                                                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Total */}
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.subtotal || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>{formatCurrency(order.shipping || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax</span>
                                    <span>{formatCurrency(order.tax || 0)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        onClick={() => router.push('/orders')}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                    >
                        <i className="fa fa-arrow-left mr-2"></i>Back to Orders
                    </button>
                    <button
                        onClick={() => router.push('/home')}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
