const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  recordedBy: { type: String, required: true },
  branchId: { type: String, required: true },
  branchName: { type: String, required: true },
});

saleSchema.virtual('id').get(function() { return this._id.toHexString(); });
saleSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Sale', saleSchema);
