const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. Add a new product
router.post('/add-product', async (req, res) => {
  try {
    const { title, price, image, tags, email } = req.body;
    const newProduct = new Product({ title, price, image, tags, email });
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
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

// 3. Fetch products by user email
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

// 5. Update single product by ID
router.put('/update-product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
