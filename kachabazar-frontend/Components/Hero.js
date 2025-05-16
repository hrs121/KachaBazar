import React from 'react';

const categories = [
  'Fresh Meat',
  'Vegetables',
  'Fruit & Nut Gifts',
  'Fresh Berries',
  'Ocean Foods',
  'Butter & Eggs',
  'Fastfood',
  'Fresh Onion',
  'Papayaya & Crisps',
  'Oatmeal',
  'Fresh Bananas',
];

const HeroSection = () => {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Categories */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-5 border">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <i className="fa fa-bars text-green-600" />
                <span>All Departments</span>
              </div>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat}>
                    <a
                      href="#"
                      className="block text-gray-600 hover:text-green-600 transition font-medium"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Search and Banner */}
          <div className="w-full lg:w-3/4 space-y-6">
            {/* Search Bar and Contact */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Search */}
              <form className="flex flex-grow w-full border rounded-xl shadow overflow-hidden bg-white">
                <div className="bg-gray-100 px-4 flex items-center text-sm font-medium text-gray-700 whitespace-nowrap">
                  All Categories
                  <span className="ml-2">&#9662;</span>
                </div>
                <input
                  type="text"
                  placeholder="What do you need?"
                  className="flex-grow px-4 py-3 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 text-sm font-semibold hover:bg-green-700 transition"
                >
                  SEARCH
                </button>
              </form>

              {/* Phone Contact */}
              <div className="flex items-center gap-4">
                <div className="text-green-600 text-3xl">
                  <i className="fa fa-phone" />
                </div>
              </div>
            </div>

            {/* Hero Banner */}
            <div
              className="relative h-72 md:h-80 rounded-xl overflow-hidden shadow-lg"
              style={{
                backgroundImage: "url('/img/hero/banner.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
              <div className="relative z-10 h-full flex flex-col justify-center pl-8 text-white">
                <span className="uppercase text-sm font-medium tracking-wide">Fruit Fresh</span>
                <h2 className="text-3xl md:text-4xl font-bold leading-snug mt-1">
                  Vegetable <br /> 100% Organic
                </h2>
                <p className="mt-2 text-sm md:text-base">Free Pickup and Delivery Available</p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
