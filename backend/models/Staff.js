const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  branchId: { type: String, required: true },
  branchName: { type: String, required: true },
  status: { type: String, default: 'Active' },
  tasksCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
});

staffSchema.virtual('id').get(function() { return this._id.toHexString(); });
staffSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Staff', staffSchema);
