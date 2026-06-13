const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  staffCount: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
});

// Since the frontend expects an id field (string), we'll add a virtual id field
marketSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
marketSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Market', marketSchema);
