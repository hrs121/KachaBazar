const express = require('express');
const router = express.Router();
const Product = require('../models/Product-simple');
const auth = require('../middleware/auth');

// 1. Add a new product (protected route)
router.post('/add-product', auth, async (req, res) => {
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
      featured 
    } = req.body;
    
    // Convert tags string to array if needed
    const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    
    const newProduct = new Product({ 
      title, 
      description,
      price: parseFloat(price), 
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      image, 
      category,
      tags: tagsArray, 
      stock: parseInt(stock) || 0,
      unit: unit || 'kg',
      email: req.user.email,
      sellerId: req.user._id,
      featured: featured || false
    });
    
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(400).json({ error: error.message });
  }
});

// 2. Fetch all products
router.get('/all-products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Fetch products by user email (updated to use auth)
router.get('/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ email: req.user.email });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Keep the old route for backward compatibility
router.get('/user-products/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const products = await Product.find({ email: userEmail });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Fetch single product by ID
router.get('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Update single product by ID (protected route)
router.put('/update-product/:id', auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;
    
    // Check if the product belongs to the authenticated user
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.email !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Delete product by ID (protected route)
router.delete('/delete-product/:id', auth, async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if the product belongs to the authenticated user
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.email !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }
    
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Fetch featured products
router.get('/featured-products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    // First try to get featured products
    let featuredProducts = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    // If no featured products, get latest products
    if (featuredProducts.length === 0) {
      featuredProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(limit);
    }
    
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Fetch products by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: category })
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
