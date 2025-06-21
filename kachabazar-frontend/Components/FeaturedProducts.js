"use client";
import React, { useState } from 'react';
import { FaHeart, FaRetweet, FaShoppingCart } from 'react-icons/fa';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

const categories = ['All', 'Fruit', 'Vegetables', 'Fresh', 'Organic'];

const products = [
  { id: '507f1f77bcf86cd799439011', title: 'Fresh Apple', price: 2.99, image: '/img/featured/feature-1.jpg', tags: ['fruit', 'fresh'] },
  { id: '507f1f77bcf86cd799439012', title: 'Organic Banana', price: 1.99, image: '/img/featured/feature-2.jpg', tags: ['fruit', 'organic'] },
  { id: '507f1f77bcf86cd799439013', title: 'Fresh Tomatoes', price: 3.49, image: '/img/featured/feature-3.jpg', tags: ['vegetables', 'fresh'] },
  { id: '507f1f77bcf86cd799439014', title: 'Green Lettuce', price: 2.29, image: '/img/featured/feature-4.jpg', tags: ['vegetables', 'green'] },
  { id: '507f1f77bcf86cd799439015', title: 'Organic Carrots', price: 2.79, image: '/img/featured/feature-5.jpg', tags: ['vegetables', 'organic'] },
  { id: '507f1f77bcf86cd799439016', title: 'Fresh Broccoli', price: 3.99, image: '/img/featured/feature-6.jpg', tags: ['vegetables', 'fresh'] },
  { id: '507f1f77bcf86cd799439017', title: 'Red Bell Pepper', price: 2.49, image: '/img/featured/feature-7.jpg', tags: ['vegetables', 'fresh'] },
  { id: '507f1f77bcf86cd799439018', title: 'Fresh Strawberries', price: 4.99, image: '/img/featured/feature-8.jpg', tags: ['fruit', 'fresh'] },
];

const FeaturedProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const { user } = useUser();

  const filtered = selectedCategory === 'All'
    ? products
    : products.filter(p => p.tags.includes(selectedCategory.toLowerCase()));

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
  };

  const handleToggleWishlist = async (productId) => {
    await toggleWishlist(productId);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Product</h2>

        {/* Filter Buttons */}
        <ul className="flex justify-center gap-4 mb-10 flex-wrap">
          {categories.map(cat => (
            <li
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer px-4 py-2 rounded-full border 
                ${selectedCategory === cat ? 'bg-green-600 text-white border-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {cat}
            </li>
          ))}
        </ul>        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                              <div
                className="h-52 bg-cover bg-center relative group rounded-t-2xl"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 rounded-t-2xl" />
                <ul className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <li>
                    <button 
                      onClick={() => handleToggleWishlist(item.id)}
                      className={`text-white text-lg hover:text-red-500 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors ${
                        user && isInWishlist(item.id) ? 'text-red-500' : ''
                      }`}
                      disabled={!user}
                    >
                      <FaHeart />
                    </button>
                  </li>                  <li>
                    <Link href={`/product-details?id=${item.id}`} className="text-white text-lg hover:text-yellow-400 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                      <FaRetweet />
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleAddToCart(item.id)}
                      className="text-white text-lg hover:text-green-400 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                      disabled={!user}
                    >
                      <FaShoppingCart />
                    </button>
                  </li>
                </ul>
              </div>
              <div className="p-4 text-center">                <h6 className="font-medium text-gray-800 hover:text-green-600">
                  <Link href={`/product-details?id=${item.id}`}>{item.title}</Link>
                </h6>
                <h5 className="text-green-600 font-bold">${item.price.toFixed(2)}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
