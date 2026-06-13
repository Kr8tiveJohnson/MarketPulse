const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  username: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String, required: true },
});

activitySchema.virtual('id').get(function() { return this._id.toHexString(); });
activitySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Activity', activitySchema);
