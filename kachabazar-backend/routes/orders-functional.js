const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart-functional');
const Product = require('../models/Product-simple');
const auth = require('../middleware/auth');

// Create new order
router.post('/create', auth, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      subtotal,
      shipping,
      tax,
      shippingAddress,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }    // Create order
    const order = new Order({
      user: req.user._id,
      orderNumber: `KBZ${Date.now()}${Math.floor(Math.random() * 1000)}`,
      items: items.map(item => ({
        product: item.product,
        productTitle: item.product?.title || 'Product',
        quantity: item.quantity,
        price: item.price,
        sellerId: req.user._id // For now, using same user as seller
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.zipCode || '0000',
        country: 'Bangladesh'
      },
      paymentMethod: paymentMethod === 'card' ? 'bank_transfer' : 'cash_on_delivery',
      totalAmount,
      shippingCost: shipping || 0,
      discount: 0,
      finalAmount: totalAmount,
      orderStatus: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();
    
    // Populate the product details
    await order.populate('items.product');    res.status(201).json({
      message: 'Order created successfully',
      _id: order._id,
      orderNumber: order.orderNumber,
      status: order.orderStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      ...order.toObject()
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status (for admin/seller)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { status },
      { new: true }
    ).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (for admin)
router.get('/admin/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.category !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const orders = await Order.find({})
      .populate('items.product')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get seller orders
router.get('/seller/orders', auth, async (req, res) => {
  try {
    // Check if user is seller
    if (req.user.category !== 'seller') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const orders = await Order.find({ 'items.sellerId': req.user._id })
      .populate('items.product')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
