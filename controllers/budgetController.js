const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
  const budgets = await Budget.find({ userId: req.userId });
  res.json(budgets);
};

exports.createBudget = async (req, res) => {
  const { goal, limit, month, year } = req.body;
  const budget = new Budget({ userId: req.userId, goal, limit, month, year });
  await budget.save();
  res.json(budget);
};


exports.updateBudget = async (req, res) => {
  const { goal, limit, month, year } = req.body;
  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { goal, limit, month, year },
    { new: true }
  );
  res.json(budget);
};

exports.deleteBudget = async (req, res) => {
  await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Budget deleted' });
};
