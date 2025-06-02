const mongoose = require('mongoose');

const recurringTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  note: String,
  startDate: { type: Date, required: true },
  frequency: { type: String, enum: ['weekly', 'monthly', 'custom'], required: true },
  customIntervalDays: { type: Number, default: null }, // only used if frequency === 'custom'
  nextRunDate: { type: Date, required: true },
});

module.exports = mongoose.model('RecurringTransaction', recurringTransactionSchema);
