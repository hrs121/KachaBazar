const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/users');
const auth = require('../middleware/auth');

// Create new order
router.post('/create', auth, async (req, res) => {
  try {
    const { 
      shippingAddress, 
      paymentMethod, 
      notes,
      shippingCost = 0,
      discount = 0
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.product.title}. Available: ${item.product.stock}` 
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      productTitle: item.product.title,
      quantity: item.quantity,
      price: item.price,
      sellerId: item.product.sellerId
    }));

    const totalAmount = cart.totalAmount;
    const finalAmount = totalAmount + shippingCost - discount;

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      shippingCost,
      discount,
      finalAmount,
      notes
    });

    await order.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Update user statistics
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 
        totalOrders: 1,
        totalSpent: finalAmount
      }
    });

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 }
    );

    await order.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'items.product', select: 'title image category' }
    ]);

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'title image category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user._id });

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
    console.error('Get my orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('user', 'firstName lastName email phoneNumber')
      .populate('items.product', 'title image category')
      .populate('items.sellerId', 'firstName lastName shopName');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin/seller
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.category !== 'admin' &&
      !order.items.some(item => item.sellerId._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status (sellers and admin only)
router.put('/:orderId/status', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(orderId).populate('items.sellerId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check permissions
    const isAdmin = req.user.category === 'admin';
    const isSeller = order.items.some(item => 
      item.sellerId._id.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isSeller) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update status
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus && isAdmin) order.paymentStatus = paymentStatus;

    // Set delivery date if status is delivered
    if (orderStatus === 'delivered' && !order.deliveryDate) {
      order.deliveryDate = new Date();
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get orders for seller
router.get('/seller/orders', auth, async (req, res) => {
  try {
    if (req.user.category !== 'seller') {
      return res.status(403).json({ error: 'Access denied. Seller only.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Find orders that contain products from this seller
    let matchQuery = {
      'items.sellerId': req.user._id
    };

    if (status) {
      matchQuery.orderStatus = status;
    }

    const orders = await Order.find(matchQuery)
      .populate('user', 'firstName lastName email phoneNumber')
      .populate('items.product', 'title image category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(matchQuery);

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

// Get all orders (admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.category !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'title image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    
    // Get order statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$finalAmount' }
        }
      }
    ]);

    res.json({
      orders,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
