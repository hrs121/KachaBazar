const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/users');
const Product = require('./models/Product');

dotenv.config();

const sampleUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@kachabazar.com',
    phoneNumber: '+8801700000000',
    category: 'admin',
    password: 'admin123',
    isEmailVerified: true
  },
  {
    firstName: 'John',
    lastName: 'Farmer',
    email: 'john.farmer@gmail.com',
    phoneNumber: '+8801700000001',
    category: 'seller',
    password: 'password123',
    shopName: 'John\'s Organic Farm',
    shopDescription: 'Fresh organic vegetables and fruits directly from our farm',
    isVerifiedSeller: true
  },
  {
    firstName: 'Sarah',
    lastName: 'Green',
    email: 'sarah.green@gmail.com',
    phoneNumber: '+8801700000002',
    category: 'seller',
    password: 'password123',
    shopName: 'Green Valley Farm',
    shopDescription: 'Premium quality dairy products and fresh produce',
    isVerifiedSeller: true
  },
  {
    firstName: 'Mike',
    lastName: 'Customer',
    email: 'mike.customer@gmail.com',
    phoneNumber: '+8801700000003',
    category: 'buyer',
    password: 'password123'
  }
];

const sampleProducts = [
  // Vegetables
  {
    title: 'Fresh Tomatoes',
    description: 'Juicy, ripe tomatoes perfect for cooking and salads. Grown organically without pesticides.',
    price: 120,
    originalPrice: 150,
    image: '/img/product/product-1.jpg',
    category: 'vegetables',
    tags: ['fresh', 'organic', 'tomato', 'vegetable'],
    stock: 50,
    unit: 'kg',
    featured: true
  },
  {
    title: 'Organic Carrots',
    description: 'Sweet and crunchy carrots rich in beta-carotene. Perfect for snacking or cooking.',
    price: 80,
    image: '/img/product/product-2.jpg',
    category: 'vegetables',
    tags: ['carrot', 'organic', 'fresh', 'healthy'],
    stock: 40,
    unit: 'kg',
    featured: false
  },
  {
    title: 'Green Leafy Spinach',
    description: 'Fresh spinach leaves packed with iron and vitamins. Great for salads and cooking.',
    price: 60,
    image: '/img/product/product-3.jpg',
    category: 'vegetables',
    tags: ['spinach', 'leafy', 'green', 'healthy'],
    stock: 25,
    unit: 'kg',
    featured: true
  },
  {
    title: 'Red Onions',
    description: 'Sharp and flavorful red onions essential for cooking. Adds great taste to any dish.',
    price: 90,
    image: '/img/product/product-4.jpg',
    category: 'vegetables',
    tags: ['onion', 'red', 'fresh', 'cooking'],
    stock: 60,
    unit: 'kg',
    featured: false
  },
  
  // Fruits
  {
    title: 'Sweet Mangoes',
    description: 'Delicious ripe mangoes bursting with tropical flavor. Perfect for desserts or eating fresh.',
    price: 200,
    originalPrice: 250,
    image: '/img/product/product-5.jpg',
    category: 'fruits',
    tags: ['mango', 'sweet', 'tropical', 'fresh'],
    stock: 30,
    unit: 'kg',
    featured: true
  },
  {
    title: 'Fresh Bananas',
    description: 'Naturally sweet bananas rich in potassium. Great for breakfast or snacks.',
    price: 80,
    image: '/img/product/product-6.jpg',
    category: 'fruits',
    tags: ['banana', 'sweet', 'fresh', 'healthy'],
    stock: 45,
    unit: 'dozen',
    featured: false
  },
  {
    title: 'Crispy Apples',
    description: 'Crunchy and sweet apples imported from Kashmir. Perfect for healthy snacking.',
    price: 180,
    originalPrice: 200,
    image: '/img/product/product-7.jpg',
    category: 'fruits',
    tags: ['apple', 'crispy', 'sweet', 'imported'],
    stock: 35,
    unit: 'kg',
    featured: true
  },
  {
    title: 'Juicy Oranges',
    description: 'Vitamin C rich oranges with natural sweetness. Great for fresh juice or eating.',
    price: 150,
    image: '/img/product/product-8.jpg',
    category: 'fruits',
    tags: ['orange', 'juicy', 'vitamin-c', 'fresh'],
    stock: 40,
    unit: 'kg',
    featured: false
  },

  // Dairy
  {
    title: 'Pure Cow Milk',
    description: 'Fresh cow milk from grass-fed cows. Rich in calcium and protein.',
    price: 60,
    image: '/img/product/product-9.jpg',
    category: 'dairy',
    tags: ['milk', 'cow', 'fresh', 'calcium'],
    stock: 20,
    unit: 'liter',
    featured: true
  },
  {
    title: 'Homemade Yogurt',
    description: 'Creamy yogurt made from pure milk. Contains healthy probiotics.',
    price: 80,
    image: '/img/product/product-10.jpg',
    category: 'dairy',
    tags: ['yogurt', 'homemade', 'probiotics', 'healthy'],
    stock: 15,
    unit: 'kg',
    featured: false
  },

  // Grains
  {
    title: 'Premium Basmati Rice',
    description: 'Long grain basmati rice with aromatic fragrance. Perfect for biryani and pilaf.',
    price: 120,
    originalPrice: 140,
    image: '/img/product/product-11.jpg',
    category: 'grains',
    tags: ['rice', 'basmati', 'premium', 'aromatic'],
    stock: 100,
    unit: 'kg',
    featured: true
  },
  {
    title: 'Whole Wheat Flour',
    description: 'Nutritious whole wheat flour perfect for making bread and chapati.',
    price: 45,
    image: '/img/product/product-12.jpg',
    category: 'grains',
    tags: ['wheat', 'flour', 'whole', 'nutritious'],
    stock: 80,
    unit: 'kg',
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Find sellers for products
    const sellers = createdUsers.filter(user => user.category === 'seller');

    // Create products
    const productsWithSellers = sampleProducts.map((product, index) => {
      const seller = sellers[index % sellers.length];
      return {
        ...product,
        email: seller.email,
        sellerId: seller._id
      };
    });

    const createdProducts = await Product.insertMany(productsWithSellers);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Test Accounts:');
    console.log('Admin: admin@kachabazar.com / admin123');
    console.log('Seller 1: john.farmer@gmail.com / password123');
    console.log('Seller 2: sarah.green@gmail.com / password123');
    console.log('Buyer: mike.customer@gmail.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
