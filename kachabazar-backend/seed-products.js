const mongoose = require('mongoose');
const Product = require('./models/Product-simple');
require('dotenv').config();

const sampleProducts = [
  { 
    _id: '507f1f77bcf86cd799439011', 
    name: 'Crab Pool Security', 
    price: 30, 
    category: 'fresh-meat',
    description: 'Fresh seafood product',
    inStock: true,
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439012', 
    name: 'Fresh Vegetables', 
    price: 25, 
    category: 'vegetables',
    description: 'Organic fresh vegetables',
    inStock: true,
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439013', 
    name: 'Organic Meat', 
    price: 35, 
    category: 'fresh-meat',
    description: 'Premium organic meat',
    inStock: true,
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439014', 
    name: 'Fast Food Item', 
    price: 20, 
    category: 'fastfood',
    description: 'Quick and tasty fast food',
    inStock: true,
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439015', 
    name: 'Fresh Fruit', 
    price: 15, 
    category: 'fruits',
    description: 'Seasonal fresh fruits',
    inStock: true,
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439016', 
    name: 'Organic Orange', 
    price: 18, 
    category: 'oranges',
    description: 'Sweet organic oranges',
    inStock: true,
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439017', 
    name: 'Premium Meat', 
    price: 45, 
    category: 'fresh-meat',
    description: 'High quality premium meat',
    inStock: true,
    email: 'seller@example.com'
  },
  { 
    _id: '507f1f77bcf86cd799439018', 
    name: 'Healthy Snack', 
    price: 12, 
    category: 'fastfood',
    description: 'Nutritious healthy snack',
    inStock: true,
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
