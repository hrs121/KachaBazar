const mongoose = require('mongoose');
const Product = require('./models/Product-simple');
require('dotenv').config();

const sampleProducts = [
  {
    title: "Fresh Apple",
    price: 2.99,
    image: "/img/featured/feature-1.jpg",
    tags: ["fruit", "fresh", "organic"],
    email: "seller@example.com"
  },
  {
    title: "Organic Banana",
    price: 1.99,
    image: "/img/featured/feature-2.jpg",
    tags: ["fruit", "organic", "tropical"],
    email: "seller@example.com"
  },
  {
    title: "Fresh Tomatoes",
    price: 3.49,
    image: "/img/featured/feature-3.jpg",
    tags: ["vegetable", "fresh", "red"],
    email: "seller@example.com"
  },
  {
    title: "Green Lettuce",
    price: 2.29,
    image: "/img/featured/feature-4.jpg",
    tags: ["vegetable", "green", "leafy"],
    email: "seller@example.com"
  },
  {
    title: "Organic Carrots",
    price: 2.79,
    image: "/img/featured/feature-5.jpg",
    tags: ["vegetable", "organic", "orange"],
    email: "seller@example.com"
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
