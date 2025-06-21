"use client";

import Header from '@/Components/Header';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { useUser } from '@/context/UserContext';
import { formatCurrency } from '@/lib/utils';
import { productsAPI } from '@/lib/api';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { addToCart, addToWishlist, removeFromWishlist, wishlist, loading } = useCartWishlist();
    const { user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    
    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (productId) {
            fetchProduct();
        } else {
            router.push('/home');
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setProductLoading(true);
            const response = await productsAPI.getProduct(productId);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Product not found');
            router.push('/home');
        } finally {
            setProductLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            router.push('/login');
            return;
        }

        try {
            await addToCart(product._id, quantity);
            toast.success('Product added to cart!');
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            toast.error('Please login to use wishlist');
            router.push('/login');
            return;
        }

        try {
            const isInWishlist = wishlist.products.some(p => p._id === product._id);
            if (isInWishlist) {
                await removeFromWishlist(product._id);
                toast.success('Removed from wishlist');
            } else {
                await addToWishlist(product._id);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    if (productLoading) {
        return (
            <div>
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-300 h-96 rounded"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                                <div className="h-20 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div>
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Product not found</h1>
                    <button
                        onClick={() => router.push('/home')}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const isInWishlist = wishlist.products.some(p => p._id === product._id);

    return (
        <div>
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex space-x-2 text-sm text-gray-500">
                        <li>
                            <button
                                onClick={() => router.push('/home')}
                                className="hover:text-green-600 transition-colors"
                            >
                                Home
                            </button>
                        </li>
                        <li className="before:content-['/'] before:mr-2">
                            <span className="text-gray-900">{product.title}</span>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                                src={product.image || '/img/placeholder.jpg'}
                                alt={product.title}
                                width={600}
                                height={600}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {product.title}
                            </h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <span className="text-3xl font-bold text-green-600">
                                    {formatCurrency(product.price)}
                                </span>
                            </div>
                            
                            {/* Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {product.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Fresh and high-quality {product.title.toLowerCase()}. Perfect for your kitchen and healthy lifestyle. 
                                {product.tags && product.tags.includes('organic') && ' This product is certified organic.'}
                            </p>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <i className="fa fa-minus text-sm"></i>
                                    </button>
                                    <span className="text-xl font-semibold px-4">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <i className="fa fa-plus text-sm"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loading}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                                >
                                    <i className="fa fa-shopping-cart"></i>
                                    <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
                                </button>
                                
                                <button
                                    onClick={handleToggleWishlist}
                                    disabled={loading}
                                    className={`px-4 py-3 rounded-lg border transition-colors ${
                                        isInWishlist
                                            ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                                            : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <i className={`fa ${isInWishlist ? 'fa-heart' : 'fa-heart-o'} text-xl`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                            <dl className="space-y-2">
                                <div className="flex">
                                    <dt className="font-medium text-gray-900 w-24">Price:</dt>
                                    <dd className="text-gray-600">{formatCurrency(product.price)}</dd>
                                </div>
                                <div className="flex">
                                    <dt className="font-medium text-gray-900 w-24">Category:</dt>
                                    <dd className="text-gray-600">
                                        {product.tags ? product.tags.join(', ') : 'General'}
                                    </dd>
                                </div>
                                <div className="flex">
                                    <dt className="font-medium text-gray-900 w-24">Seller:</dt>
                                    <dd className="text-gray-600">{product.email}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
                    <div className="text-center text-gray-500">
                        <p>Related products coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
