const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing KachaBazar API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', healthResponse.data);

    // Test 2: Register a test user
    console.log('\n2. Testing user registration...');
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      confirmPassword: 'password123',
      category: 'buyer'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE}/users/register`, testUser);
      console.log('✅ User registration successful');
      console.log('Token received:', !!registerResponse.data.token);
    } catch (error) {
      if (error.response?.data?.message === 'Email already exists') {
        console.log('ℹ️ User already exists, proceeding to login...');
      } else {
        throw error;
      }
    }

    // Test 3: Login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE}/users/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    console.log('Token received:', !!token);

    // Test 4: Get user profile
    console.log('\n4. Testing protected route (user profile)...');
    const profileResponse = await axios.get(`${API_BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile fetch successful:', profileResponse.data.email);

    // Test 5: Create a product
    console.log('\n5. Testing product creation...');
    const testProduct = {
      title: 'Test Product',
      price: 99.99,
      image: 'test-image.jpg',
      tags: ['test', 'product']
    };
    const productResponse = await axios.post(`${API_BASE}/products/add-product`, testProduct, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Product created:', productResponse.data.title);
    const productId = productResponse.data._id;

    // Test 6: Get all products
    console.log('\n6. Testing get all products...');
    const allProductsResponse = await axios.get(`${API_BASE}/products/all-products`);
    console.log('✅ Products fetched:', allProductsResponse.data.length, 'products');

    // Test 7: Get user's products
    console.log('\n7. Testing get my products...');
    const myProductsResponse = await axios.get(`${API_BASE}/products/my-products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ My products fetched:', myProductsResponse.data.length, 'products');

    // Test 8: Update product
    console.log('\n8. Testing product update...');
    await axios.put(`${API_BASE}/products/update-product/${productId}`, {
      title: 'Updated Test Product',
      price: 149.99
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Product updated successfully');

    // Test 9: Delete product
    console.log('\n9. Testing product deletion...');
    await axios.delete(`${API_BASE}/products/delete-product/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Product deleted successfully');

    console.log('\n🎉 All API tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('\n❌ API test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testAPI();
