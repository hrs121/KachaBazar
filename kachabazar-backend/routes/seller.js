const express = require('express');
const router = express.Router();
const Product = require('../models/Product-simple');
const User = require('../models/users-simple');
const auth = require('../middleware/auth');

// Middleware to check if user is a seller
const requireSeller = (req, res, next) => {
  if (req.user.category !== 'seller') {
    return res.status(403).json({ error: 'Access denied. Seller only.' });
  }
  next();
};

// ==================== PRODUCT MANAGEMENT ====================

// Get seller's products
router.get('/my-products', auth, requireSeller, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ email: req.user.email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ email: req.user.email });

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new product
router.post('/add-product', auth, requireSeller, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      originalPrice,
      image, 
      category,
      tags, 
      stock,
      unit,
      featured = false
    } = req.body;

    // Process tags - convert string to array if needed
    let processedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else if (Array.isArray(tags)) {
        processedTags = tags;
      }
    }

    const newProduct = new Product({ 
      title, 
      description,
      price: parseFloat(price), 
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      image, 
      category,
      tags: processedTags, 
      stock: parseInt(stock) || 0,
      unit,
      email: req.user.email,
      sellerId: req.user._id,
      featured: Boolean(featured)
    });

    const savedProduct = await newProduct.save();
    
    res.status(201).json({
      message: 'Product added successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update product
router.put('/update-product/:id', auth, requireSeller, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user owns this product
    if (product.email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete product
router.delete('/delete-product/:id', auth, requireSeller, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user owns this product
    if (product.email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Product.findByIdAndDelete(productId);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDER MANAGEMENT ====================

// Get seller's orders (simplified - returns empty for now)
router.get('/orders', auth, requireSeller, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // For now, return empty orders array
    // This can be enhanced when proper order management is implemented
    const orders = [];
    const total = 0;

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get seller's purchase history (simplified - returns empty for now)
router.get('/purchase-history', auth, requireSeller, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // For now, return empty orders array
    // This can be enhanced when proper order management is implemented
    const orders = [];
    const total = 0;

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get seller purchase history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== DASHBOARD & ANALYTICS ====================

// Get seller dashboard data
router.get('/dashboard', auth, requireSeller, async (req, res) => {
  try {
    // Get seller's products count
    const totalProducts = await Product.countDocuments({ email: req.user.email });
    
    // Get active products count
    const activeProducts = await Product.countDocuments({ 
      email: req.user.email, 
      stock: { $gt: 0 }
    });

    // For now, we'll use simplified stats until Order model is properly set up
    const totalOrders = 0;
    const totalEarnings = 0;
    const purchaseHistory = 0;
    const recentOrders = [];

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        totalEarnings,
        purchaseHistory
      },
      recentOrders
    });
  } catch (error) {
    console.error('Get seller dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROFILE MANAGEMENT ====================

// Update seller profile
router.put('/profile', auth, requireSeller, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, shopName, shopDescription } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (shopName) user.shopName = shopName;
    if (shopDescription) user.shopDescription = shopDescription;

    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
