"use client";

import Header from '@/Components/Header';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { useUser } from '@/context/UserContext';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Cart = () => {
    const { cart, updateCartQuantity, removeFromCart, clearCart, loading } = useCartWishlist();
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const handleQuantityChange = async (productId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            await removeFromCart(productId);
        } else {
            await updateCartQuantity(productId, newQuantity);
        }
    };

    const handleRemoveItem = async (productId) => {
        await removeFromCart(productId);
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            await clearCart();
        }
    };

    if (!user) {
        return null; // Will redirect to login
    }

    if (cart.items.length === 0) {
        return (
            <div>
                <Header />
                <div className="max-w-5xl mx-auto p-4 py-16 text-center">
                    <div className="mb-8">
                        <i className="fa fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                        <h1 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h1>
                        <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
                        <button
                            onClick={() => router.push('/home')}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="max-w-5xl max-lg:max-w-2xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-red-600 hover:text-red-700"
                        disabled={loading}
                    >
                        Clear Cart
                    </button>
                </div>
                
                <div className="grid lg:grid-cols-3 lg:gap-x-8 gap-x-6 gap-y-8 mt-6">
                    <div className="lg:col-span-2 space-y-6">
                        {cart.items.map((item) => (
                            <div key={item._id} className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200">
                                <div className="flex gap-6 sm:gap-4 max-sm:flex-col flex-1">
                                    <div className="w-24 h-24 max-sm:w-24 max-sm:h-24 shrink-0">
                                        <Image 
                                            src={item.product?.image || '/img/placeholder.jpg'} 
                                            alt={item.product?.title || 'Product'}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4 flex-1">
                                        <div>
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                                                {item.product?.title || 'Product'}
                                            </h3>
                                            <p className="text-[13px] font-medium text-gray-500 mt-2">
                                                Price: {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="mt-auto">
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                Total: {formatCurrency(item.price * item.quantity)}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-auto flex flex-col">
                                    <div className="flex items-start gap-4 justify-end mb-4">
                                        <button
                                            onClick={() => handleRemoveItem(item.product._id)}
                                            className="w-4 h-4 cursor-pointer fill-gray-400 hover:fill-red-600"
                                            disabled={loading}
                                        >
                                            <i className="fa fa-trash text-red-500 hover:text-red-700"></i>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 mt-auto">
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                                            className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-gray-400 outline-none rounded-full hover:bg-gray-500"
                                            disabled={loading}
                                        >
                                            <i className="fa fa-minus text-white text-xs"></i>
                                        </button>
                                        <span className="font-semibold text-base leading-[18px]">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                                            className="flex items-center justify-center w-[18px] h-[18px] cursor-pointer bg-gray-800 outline-none rounded-full hover:bg-gray-900"
                                            disabled={loading}
                                        >
                                            <i className="fa fa-plus text-white text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-md px-4 py-6 h-max shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <ul className="text-gray-500 font-medium space-y-4">
                            <li className="flex flex-wrap gap-4 text-sm">
                                Subtotal 
                                <span className="ml-auto font-semibold text-gray-900">
                                    {formatCurrency(cart.totalAmount || 0)}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Shipping 
                                <span className="ml-auto font-semibold text-gray-900">
                                    {formatCurrency(cart.totalAmount > 500 ? 0 : 50)}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Tax 
                                <span className="ml-auto font-semibold text-gray-900">
                                    {formatCurrency((cart.totalAmount || 0) * 0.1)}
                                </span>
                            </li>
                            <hr className="border-gray-300" />
                            <li className="flex flex-wrap gap-4 text-sm font-semibold text-gray-900">
                                Total 
                                <span className="ml-auto">
                                    {formatCurrency(
                                        (cart.totalAmount || 0) + 
                                        (cart.totalAmount > 500 ? 0 : 50) + 
                                        ((cart.totalAmount || 0) * 0.1)
                                    )}
                                </span>
                            </li>
                        </ul>
                        <div className="mt-8 space-y-4">
                            <button
                                type="button"
                                className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-green-600 hover:bg-green-700 text-white rounded-md cursor-pointer transition-colors"
                                disabled={loading}
                            >
                                Proceed to Checkout
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/home')}
                                className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-300 rounded-md cursor-pointer transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
