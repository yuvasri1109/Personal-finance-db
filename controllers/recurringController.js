const RecurringTransaction = require('../models/RecurringTransaction');

// Helper to calculate nextRunDate based on frequency
function calculateNextRunDate(startDate, frequency, customIntervalDays) {
  const nextRunDate = new Date(startDate);

  if (frequency === 'weekly') {
    nextRunDate.setDate(nextRunDate.getDate() + 7);
  } else if (frequency === 'monthly') {
    nextRunDate.setMonth(nextRunDate.getMonth() + 1);
  } else if (frequency === 'custom') {
    nextRunDate.setDate(nextRunDate.getDate() + parseInt(customIntervalDays));
  }

  return nextRunDate;
}

exports.createRecurring = async (req, res) => {
  try {
    const { amount, type, category, note, startDate, frequency, customIntervalDays } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID missing.' });
    }

    if (!amount || !type || !category || !startDate || !frequency) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    if (frequency === 'custom' && !customIntervalDays) {
      return res.status(400).json({ error: 'customIntervalDays required for custom frequency.' });
    }

    const nextRunDate = calculateNextRunDate(startDate, frequency, customIntervalDays);

    const recurring = await RecurringTransaction.create({
      userId,
      amount,
      type,
      category,
      note,
      startDate,
      frequency,
      customIntervalDays: frequency === 'custom' ? customIntervalDays : null,
      nextRunDate,
    });

    res.status(201).json(recurring);
  } catch (err) {
    console.error('Error in createRecurring:', err);
    res.status(500).json({ error: 'Failed to create recurring transaction', details: err.message });
  }
};

exports.getRecurringTransactions = async (req, res) => {
  try {
    const recurringTx = await RecurringTransaction.find({ userId: req.user.id });
    res.json(recurringTx);
  } catch (error) {
    console.error('Error fetching recurring transactions:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.updateRecurring = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find existing record and check ownership
    const recurring = await RecurringTransaction.findById(id);
    if (!recurring) {
      return res.status(404).json({ error: 'Recurring transaction not found.' });
    }
    if (recurring.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this recurring transaction.' });
    }

    // If frequency or startDate or customIntervalDays updated, recalculate nextRunDate
    let nextRunDate = recurring.nextRunDate; // default keep old nextRunDate
    const { frequency, startDate, customIntervalDays } = req.body;

    if (frequency || startDate || customIntervalDays !== undefined) {
      // Use new values if provided, else fallback to existing
      const newFrequency = frequency || recurring.frequency;
      const newStartDate = startDate || recurring.startDate;
      const newCustomIntervalDays = customIntervalDays !== undefined ? customIntervalDays : recurring.customIntervalDays;

      nextRunDate = calculateNextRunDate(newStartDate, newFrequency, newCustomIntervalDays);
      req.body.nextRunDate = nextRunDate;
    }

    const updated = await RecurringTransaction.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Error updating recurring transaction:', error);
    res.status(500).json({ message: 'Update failed', details: error.message });
  }
};

exports.deleteRecurring = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const recurring = await RecurringTransaction.findById(id);
    if (!recurring) {
      return res.status(404).json({ error: 'Recurring transaction not found.' });
    }
    if (recurring.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this recurring transaction.' });
    }

    await RecurringTransaction.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting recurring transaction:', error);
    res.status(500).json({ message: 'Deletion failed', details: error.message });
  }
};
