const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get all savings goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id });
    res.json(goals);
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new savings goal
exports.createGoal = async (req, res) => {
  const { title, targetAmount, currentAmount, deadline } = req.body;

  try {
    const newGoal = new SavingsGoal({
      userId: req.user.id,
      title,
      targetAmount,
      currentAmount,
      deadline,
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    console.error('Error creating goal:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a savings goal
exports.updateGoal = async (req, res) => {
  const { id } = req.params;
  const { title, targetAmount, currentAmount, deadline } = req.body;

  try {
    // Find the goal owned by the user
    const goal = await SavingsGoal.findOne({ _id: id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    // Update only the provided fields
    if (title !== undefined) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = targetAmount;
    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (deadline !== undefined) goal.deadline = deadline;

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a savings goal
exports.deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await SavingsGoal.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error('Error deleting goal:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
