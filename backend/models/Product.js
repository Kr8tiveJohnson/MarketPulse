const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  minStock: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  branchId: { type: String, required: true },
});

productSchema.virtual('id').get(function() { return this._id.toHexString(); });
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
