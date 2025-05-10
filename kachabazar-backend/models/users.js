const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String
});

module.exports = mongoose.model('User', UserSchema);
