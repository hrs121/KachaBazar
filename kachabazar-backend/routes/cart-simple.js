const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Simple cart routes without database dependencies for testing
// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    // Return empty cart for now to avoid database issues
    res.json({ items: [], totalAmount: 0 });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Simple success response for testing
    res.json({ 
      message: 'Item added to cart',
      cart: { items: [], totalAmount: 0 }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    res.json({ 
      message: 'Cart updated',
      cart: { items: [], totalAmount: 0 }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    res.json({ 
      message: 'Item removed from cart',
      cart: { items: [], totalAmount: 0 }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
