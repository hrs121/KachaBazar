import React from 'react';

const categories = [
  { title: 'Fresh Fruit', image: '/img/categories/cat-1.jpg' },
  { title: 'Dried Fruit', image: '/img/categories/cat-2.jpg' },
  { title: 'Vegetables', image: '/img/categories/cat-3.jpg' },
  { title: 'Drink Fruits', image: '/img/categories/cat-4.jpg' },
  { title: 'Drink Fruits', image: '/img/categories/cat-5.jpg' },
];

const CategoriesSection = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="min-w-[220px] h-52 bg-cover bg-center rounded-xl relative shadow hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div className="absolute inset-0 bg-black/30 rounded-xl" />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <h5 className="text-white text-lg font-semibold">
                    <a href="#" className="hover:underline">{category.title}</a>
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
