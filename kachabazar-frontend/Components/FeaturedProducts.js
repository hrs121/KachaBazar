"use client";
import React, { useState, useEffect } from 'react';
import { FaHeart, FaRetweet, FaShoppingCart } from 'react-icons/fa';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { useUser } from '@/context/UserContext';
import { productsAPI } from '@/lib/api';
import Link from 'next/link';

const categories = ['All', 'vegetables', 'fruits', 'dairy', 'meat', 'fish', 'grains', 'beverages', 'snacks', 'spices', 'others'];

const FeaturedProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const { user } = useUser();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getFeaturedProducts(8);
      console.log('API Response:', response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setProducts([]); // Show empty state instead of hardcoded data
    } finally {
      setLoading(false);
    }
  };

  const filtered = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory || (p.tags && p.tags.includes(selectedCategory)));

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
              className={`cursor-pointer px-4 py-2 rounded-full border capitalize
                ${selectedCategory === cat ? 'bg-green-600 text-white border-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {cat === 'All' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </li>
          ))}
        </ul>        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading featured products...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found for the selected category.</p>
            <p className="text-gray-400 text-sm mt-2">Try selecting a different category or add some products as a seller.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(item => (
                <div
                  key={item._id || item.id}
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
                        onClick={() => handleToggleWishlist(item._id || item.id)}
                        className={`text-white text-lg hover:text-red-500 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors ${
                          user && isInWishlist(item._id || item.id) ? 'text-red-500' : ''
                        }`}
                        disabled={!user}
                      >
                        <FaHeart />
                      </button>
                    </li>                    <li>
                      <Link href={`/product-details?id=${item._id || item.id}`} className="text-white text-lg hover:text-yellow-400 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                        <FaRetweet />
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleAddToCart(item._id || item.id)}
                        className="text-white text-lg hover:text-green-400 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                        disabled={!user}
                      >
                        <FaShoppingCart />
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="p-4 text-center">                  <h6 className="font-medium text-gray-800 hover:text-green-600">
                    <Link href={`/product-details?id=${item._id || item.id}`}>{item.title}</Link>
                  </h6>
                  <h5 className="text-green-600 font-bold">${item.price.toFixed(2)}</h5>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</p>
                  )}
                  {item.unit && (
                    <p className="text-sm text-gray-500">Per {item.unit}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
