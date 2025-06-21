const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Simple order model (in-memory for testing)
let orders = [];
let orderCounter = 1;

// Create new order
router.post('/create', auth, async (req, res) => {
  try {
    const order = {
      _id: `order_${orderCounter++}`,
      user: req.user._id,
      orderNumber: `KBZ${Date.now()}`,
      ...req.body,
      status: 'pending',
      createdAt: new Date()
    };
    
    orders.push(order);
    
    res.status(201).json({
      message: 'Order created successfully',
      ...order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const userOrders = orders.filter(order => order.user.toString() === req.user._id.toString());
    res.json(userOrders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = orders.find(order => 
      order._id === req.params.id && 
      order.user.toString() === req.user._id.toString()
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
