const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  reporterName: { type: String, required: true },
  contactInfo: { type: String, required: true },
  itemName: { type: String, required: true },
  category: {
    type: String,
    enum: ['Electronics', 'ID/Cards', 'Keys', 'Clothing', 'Books', 'Other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Lost', 'Found', 'Claimed'],
    default: 'Lost',
  },
  description: { type: String, default: '' },
  dateReported: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', itemSchema);
