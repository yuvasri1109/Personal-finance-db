const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
  res.json(transactions);
};

exports.createTransaction = async (req, res) => {
  const { amount, type, category, date } = req.body;
  const transaction = new Transaction({ userId: req.userId, amount, type, category, date });
  await transaction.save();
  res.json(transaction);
};

exports.deleteTransaction = async (req, res) => {
  await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Transaction deleted' });
};
