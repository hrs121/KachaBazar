const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/users');
const auth = require('../middleware/auth');

// Add a new product (sellers only)
router.post('/add-product', auth, async (req, res) => {
  try {
    if (req.user.category !== 'seller') {
      return res.status(403).json({ error: 'Access denied. Seller only.' });
    }

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

    const newProduct = new Product({ 
      title, 
      description,
      price, 
      originalPrice,
      image, 
      category,
      tags, 
      stock,
      unit,
      email: req.user.email,
      sellerId: req.user._id,
      featured
    });

    const savedProduct = await newProduct.save();
    await savedProduct.populate('sellerId', 'firstName lastName shopName');
    
    res.status(201).json({
      message: 'Product added successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Fetch all products with filters and pagination
router.get('/all-products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Filters
    const category = req.query.category;
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    const search = req.query.search;
    const featured = req.query.featured === 'true';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    let query = { isActive: true, stock: { $gt: 0 } };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minPrice || maxPrice !== Infinity) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (featured) {
      query.featured = true;
    }

    // Build sort object
    let sort = {};
    sort[sortBy] = sortOrder;

    const products = await Product.find(query)
      .populate('sellerId', 'firstName lastName shopName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    // Get categories for filter
    const categories = await Product.distinct('category', { isActive: true });

    res.json({
      products,
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch featured products
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({ 
      isActive: true, 
      featured: true, 
      stock: { $gt: 0 } 
    })
    .populate('sellerId', 'firstName lastName shopName')
    .sort({ createdAt: -1 })
    .limit(limit);

    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch products by user email (seller's products)
router.get('/user-products/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ email: userEmail })
      .populate('sellerId', 'firstName lastName shopName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ email: userEmail });

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
    console.error('Get user products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch seller's own products
router.get('/my-products', auth, async (req, res) => {
  try {
    if (req.user.category !== 'seller') {
      return res.status(403).json({ error: 'Access denied. Seller only.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ sellerId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ sellerId: req.user._id });

    // Get seller statistics
    const stats = await Product.aggregate([
      { $match: { sellerId: req.user._id } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalStock: { $sum: '$stock' },
          outOfStock: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      products,
      stats: stats[0] || {},
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch single product by ID
router.get('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId)
      .populate('sellerId', 'firstName lastName shopName phoneNumber');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get related products (same category, different product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: productId },
      isActive: true,
      stock: { $gt: 0 }
    })
    .populate('sellerId', 'firstName lastName shopName')
    .limit(4);

    res.json({
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update single product by ID (seller only)
router.put('/update-product/:id', auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user owns this product or is admin
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.category !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true, runValidators: true }
    ).populate('sellerId', 'firstName lastName shopName');

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete product (seller only)
router.delete('/delete-product/:id', auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user owns this product or is admin
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.category !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Product.findByIdAndDelete(productId);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Toggle product active status
router.patch('/toggle-status/:id', auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check permissions
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.category !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      product
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q, category, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true, stock: { $gt: 0 } };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('sellerId', 'firstName lastName shopName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
