const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  uploaderName: { type: String, required: true },
  branchName: { type: String, required: true },
  date: { type: String, required: true },
});

reportSchema.virtual('id').get(function() { return this._id.toHexString(); });
reportSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Report', reportSchema);
