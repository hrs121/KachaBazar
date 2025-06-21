const mongoose = require('mongoose');
const Product = require('./models/Product-simple');
require('dotenv').config();

const sampleProducts = [
  { 
    _id: '507f1f77bcf86cd799439011', 
    title: 'Fresh Apple', 
    price: 2.99, 
    image: '/img/featured/feature-1.jpg',
    tags: ['fruit', 'fresh', 'organic'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439012', 
    title: 'Organic Banana', 
    price: 1.99, 
    image: '/img/featured/feature-2.jpg',
    tags: ['fruit', 'organic', 'tropical'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439013', 
    title: 'Fresh Tomatoes', 
    price: 3.49, 
    image: '/img/featured/feature-3.jpg',
    tags: ['vegetable', 'fresh', 'red'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439014', 
    title: 'Green Lettuce', 
    price: 2.29, 
    image: '/img/featured/feature-4.jpg',
    tags: ['vegetable', 'green', 'leafy'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439015', 
    title: 'Organic Carrots', 
    price: 2.79, 
    image: '/img/featured/feature-5.jpg',
    tags: ['vegetable', 'organic', 'orange'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439016', 
    title: 'Fresh Broccoli', 
    price: 3.99, 
    image: '/img/featured/feature-6.jpg',
    tags: ['vegetable', 'green', 'healthy'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439017', 
    title: 'Red Bell Pepper', 
    price: 2.49, 
    image: '/img/featured/feature-7.jpg',
    tags: ['vegetable', 'red', 'sweet'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439018', 
    title: 'Fresh Strawberries', 
    price: 4.99, 
    image: '/img/featured/feature-8.jpg',
    tags: ['fruit', 'berry', 'sweet'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439019', 
    title: 'Organic Spinach', 
    price: 2.99, 
    image: '/img/product/product-1.jpg',
    tags: ['vegetable', 'leafy', 'iron'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd79943901a', 
    title: 'Yellow Onions', 
    price: 1.79, 
    image: '/img/product/product-2.jpg',
    tags: ['vegetable', 'cooking', 'flavor'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd79943901b', 
    title: 'Fresh Mushrooms', 
    price: 3.29, 
    image: '/img/product/product-3.jpg',
    tags: ['vegetable', 'umami', 'protein'],
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd79943901c', 
    title: 'Organic Avocado', 
    price: 1.99, 
    image: '/img/product/product-4.jpg',
    tags: ['fruit', 'healthy', 'fat'],
    email: 'seller@example.com'
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} sample products`);
    
    insertedProducts.forEach(product => {
      console.log(`- ${product.title}: $${product.price} (ID: ${product._id})`);
    });
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
