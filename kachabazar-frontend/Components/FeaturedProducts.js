"use client";
import React, { useState } from 'react';
import { FaHeart, FaRetweet, FaShoppingCart } from 'react-icons/fa';

const categories = ['All', 'Oranges', 'Fresh Meat', 'Vegetables', 'Fastfood'];

const products = [
  { id: 1, title: 'Crab Pool Security', price: 30, image: '/img/featured/feature-1.jpg', tags: ['oranges', 'fresh-meat'] },
  { id: 2, title: 'Crab Pool Security', price: 30, image: '/img/featured/feature-2.jpg', tags: ['vegetables', 'fastfood'] },
  { id: 3, title: 'Crab Pool Security', price: 30, image: '/img/featured/feature-3.jpg', tags: ['vegetables', 'fresh-meat'] },
  { id: 4, title: 'Crab Pool Security', price: 30, image: '/img/featured/feature-4.jpg', tags: ['fastfood', 'oranges'] },
  { id: 5, title: 'Crab Pool Security', price: 30, image: '/img/featured/feature-5.jpg', tags: ['fresh-meat', 'vegetables'] },
  { id: 6, title: 'Crab Pool Security', price: 30, image: '/img/featured/feature-6.jpg', tags: ['oranges', 'fastfood'] },
  { id: 7, title: 'Crab Pool Security', price: 30, image: '/img/featured/feature-7.jpg', tags: ['fresh-meat', 'vegetables'] },
  { id: 8, title: 'Crab Pool Security', price: 30, image: '/img/featured/feature-8.jpg', tags: ['fastfood', 'vegetables'] },
];

const FeaturedProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = selectedCategory === 'All'
    ? products
    : products.filter(p => p.tags.includes(selectedCategory.toLowerCase()));

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
        </ul>

        {/* Product Grid */}
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
                  <li><a href="#" className="text-white text-lg hover:text-red-500"><FaHeart /></a></li>
                  <li><a href="#" className="text-white text-lg hover:text-yellow-400"><FaRetweet /></a></li>
                  <li><a href="#" className="text-white text-lg hover:text-green-400"><FaShoppingCart /></a></li>
                </ul>
              </div>
              <div className="p-4 text-center">
                <h6 className="font-medium text-gray-800 hover:text-green-600">
                  <a href="#">{item.title}</a>
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
