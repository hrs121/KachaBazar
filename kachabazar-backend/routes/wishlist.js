const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product-simple');
const auth = require('../middleware/auth');

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    
    if (!wishlist) {
      return res.json({ products: [] });
    }

    res.json(wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add item to wishlist
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [productId]
      });
    } else {
      // Check if product already in wishlist
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ error: 'Product already in wishlist' });
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate('products');

    res.json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove item from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    await wishlist.populate('products');

    res.json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Toggle item in wishlist
router.post('/toggle', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [productId]
      });
      await wishlist.save();
      await wishlist.populate('products');
      return res.json({ message: 'Product added to wishlist', wishlist, added: true });
    }

    const productIndex = wishlist.products.indexOf(productId);
    if (productIndex > -1) {
      // Product exists, remove it
      wishlist.products.splice(productIndex, 1);
      await wishlist.save();
      await wishlist.populate('products');
      return res.json({ message: 'Product removed from wishlist', wishlist, added: false });
    } else {
      // Product doesn't exist, add it
      wishlist.products.push(productId);
      await wishlist.save();
      await wishlist.populate('products');
      return res.json({ message: 'Product added to wishlist', wishlist, added: true });
    }
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear wishlist
router.delete('/clear', auth, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
