// Quick test to verify seller routes work
const jwt = require('jsonwebtoken');

// Test JWT token generation
const testUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'test.seller@example.com',
  category: 'seller'
};

const token = jwt.sign(
  { 
    userId: testUser._id, 
    email: testUser.email,
    category: testUser.category 
  },
  process.env.JWT_SECRET || 'test-secret',
  { expiresIn: '24h' }
);

console.log('Test seller token:', token);
console.log('Seller routes should be accessible at:');
console.log('- GET /api/seller/dashboard');
console.log('- GET /api/seller/my-products');
console.log('- POST /api/seller/add-product');
console.log('- PUT /api/seller/update-product/:id');
console.log('- DELETE /api/seller/delete-product/:id');
console.log('- GET /api/seller/orders');
console.log('- GET /api/seller/purchase-history');
console.log('- PUT /api/seller/profile');
