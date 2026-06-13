const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  googleId: { type: String },
  role: { type: String, enum: ['Admin', 'Staff'], required: true },
  branchId: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
