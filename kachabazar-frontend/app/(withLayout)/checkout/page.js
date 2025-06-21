"use client";

import Header from '@/Components/Header';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { useUser } from '@/context/UserContext';
import { formatCurrency } from '@/lib/utils';
import { ordersAPI } from '@/lib/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cart, clearCart, loading } = useCartWishlist();
    const { user } = useUser();
    const router = useRouter();
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderData, setOrderData] = useState({
        shippingAddress: {
            fullName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: ''
        },
        paymentMethod: 'card'
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (cart.items.length === 0) {
            router.push('/shopping-cart');
            return;
        }
    }, [user, cart.items.length, router]);

    const handleInputChange = (section, field, value) => {
        setOrderData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const calculateTotals = () => {
        const subtotal = cart.totalAmount || 0;
        const shipping = subtotal > 500 ? 0 : 50;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;
        return { subtotal, shipping, tax, total };
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setOrderLoading(true);

        try {
            const { subtotal, shipping, tax, total } = calculateTotals();
            
            const order = {
                items: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: total,
                subtotal,
                shipping,
                tax,
                shippingAddress: orderData.shippingAddress,
                paymentMethod: orderData.paymentMethod,
                status: 'pending'
            };

            const response = await ordersAPI.createOrder(order);
              if (response.data) {
                toast.success('Order placed successfully!');
                await clearCart();
                router.push(`/orders/${response.data._id}?id=${response.data._id}`);
            }
        } catch (error) {
            console.error('Order error:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setOrderLoading(false);
        }
    };

    if (!user || cart.items.length === 0) {
        return null; // Will redirect
    }

    const { subtotal, shipping, tax, total } = calculateTotals();

    return (
        <div>
            <Header />
            <div className="max-w-6xl mx-auto p-4 py-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-8">Checkout</h1>
                
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Order Form */}
                    <div className="space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                            <form onSubmit={handlePlaceOrder} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={orderData.shippingAddress.fullName}
                                        onChange={(e) => handleInputChange('shippingAddress', 'fullName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address *
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={orderData.shippingAddress.address}
                                        onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter your full address"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={orderData.shippingAddress.city}
                                            onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={orderData.shippingAddress.state}
                                            onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="State"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Zip Code *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={orderData.shippingAddress.zipCode}
                                            onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Zip Code"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={orderData.shippingAddress.phone}
                                            onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={orderData.paymentMethod === 'card'}
                                        onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                        className="mr-3"
                                    />
                                    <span>Credit/Debit Card</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={orderData.paymentMethod === 'cash'}
                                        onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                        className="mr-3"
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-max">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                        
                        {/* Cart Items */}
                        <div className="space-y-4 mb-6">
                            {cart.items.map((item) => (
                                <div key={item._id} className="flex gap-3">
                                    <div className="w-16 h-16">
                                        <Image 
                                            src={item.product?.image || '/img/placeholder.jpg'} 
                                            alt={item.product?.title || 'Product'}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {item.product?.title || 'Product'}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity} × {formatCurrency(item.price)}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>{formatCurrency(shipping)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={orderLoading || loading}
                            className="w-full mt-6 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors"
                        >
                            {orderLoading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
