const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
});

module.exports = mongoose.model('Budget', budgetSchema);
