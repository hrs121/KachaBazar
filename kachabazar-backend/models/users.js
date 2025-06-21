const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  address: String,
  city: String,
  postalCode: String,
  country: { type: String, default: 'Bangladesh' },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phoneNumber: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['buyer', 'seller', 'admin']
  },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  addresses: [addressSchema],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // Seller specific fields
  shopName: { type: String, trim: true },
  shopDescription: { type: String, trim: true },
  businessLicense: { type: String },
  isVerifiedSeller: { type: Boolean, default: false },
  // Statistics
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Index for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ category: 1 });

module.exports = mongoose.model('User', UserSchema);
