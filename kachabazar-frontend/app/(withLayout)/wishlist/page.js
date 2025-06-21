"use client";

import Header from '@/Components/Header';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { useUser } from '@/context/UserContext';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist, addToCart, loading } = useCartWishlist();
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const handleRemoveFromWishlist = async (productId) => {
        await removeFromWishlist(productId);
    };

    const handleAddToCart = async (productId) => {
        const success = await addToCart(productId);
        if (success) {
            // Optionally remove from wishlist after adding to cart
            // await removeFromWishlist(productId);
        }
    };

    if (!user) {
        return null; // Will redirect to login
    }

    if (wishlist.products.length === 0) {
        return (
            <div>
                <Header />
                <div className="max-w-5xl mx-auto p-4 py-16 text-center">
                    <div className="mb-8">
                        <i className="fa fa-heart text-6xl text-gray-300 mb-4"></i>
                        <h1 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h1>
                        <p className="text-gray-500 mb-6">Start shopping to add items to your wishlist</p>
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
            <div className="max-w-6xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">My Wishlist</h1>
                    <span className="text-gray-500">{wishlist.products.length} items</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">                            <div className="relative">
                                <Link href={`/product-details?id=${product._id}`}>
                                    <Image
                                        src={product.image || '/img/placeholder.jpg'}
                                        alt={product.title}
                                        width={300}
                                        height={200}
                                        className="w-full h-48 object-cover hover:scale-105 transition-transform"
                                    />
                                </Link>
                                <button
                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                                    disabled={loading}
                                >
                                    <i className="fa fa-heart text-red-500 hover:text-red-600"></i>
                                </button>
                            </div>
                              <div className="p-4">
                                <Link href={`/product-details?id=${product._id}`}>
                                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors line-clamp-2">
                                        {product.title}
                                    </h3>
                                </Link>
                                
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-lg font-bold text-green-600">
                                        {formatCurrency(product.price)}
                                    </span>
                                    {product.tags && product.tags.length > 0 && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {product.tags[0]}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(product._id)}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-sm font-medium"
                                        disabled={loading}
                                    >
                                        <i className="fa fa-shopping-cart mr-2"></i>
                                        Add to Cart
                                    </button>
                                    <Link
                                        href={`/product-details/${product._id}`}
                                        className="flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors"
                                    >
                                        <i className="fa fa-eye"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/home')}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
