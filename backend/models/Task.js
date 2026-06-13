const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  staffId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, default: 'Pending' },
});

taskSchema.virtual('id').get(function() { return this._id.toHexString(); });
taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
