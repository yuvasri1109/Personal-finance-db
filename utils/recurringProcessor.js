const RecurringTransaction = require('../models/RecurringTransaction');
const Transaction = require('../models/Transaction'); // Your main Transaction model
const mongoose = require('mongoose');

async function processRecurringTransactions() {
  try {
    const now = new Date();

    // Find all recurring transactions where nextRunDate is due or passed
    const dueRecurrings = await RecurringTransaction.find({
      nextRunDate: { $lte: now }
    });

    for (const recurring of dueRecurrings) {
      // Create a new actual transaction based on the recurring transaction
      const newTransaction = new Transaction({
        userId: recurring.userId,
        amount: recurring.amount,
        type: recurring.type,
        category: recurring.category,
        note: recurring.note,
        date: recurring.nextRunDate // The date transaction runs
      });

      await newTransaction.save();

      // Calculate the next nextRunDate based on frequency
      let nextRunDate = new Date(recurring.nextRunDate);

      if (recurring.frequency === 'weekly') {
        nextRunDate.setDate(nextRunDate.getDate() + 7);
      } else if (recurring.frequency === 'monthly') {
        nextRunDate.setMonth(nextRunDate.getMonth() + 1);
      } else if (recurring.frequency === 'custom' && recurring.customIntervalDays) {
        nextRunDate.setDate(nextRunDate.getDate() + recurring.customIntervalDays);
      } else {
        // If frequency invalid, skip updating
        continue;
      }

      // Update recurring transaction's nextRunDate to the newly computed one
      recurring.nextRunDate = nextRunDate;
      await recurring.save();
    }

    console.log(`Processed ${dueRecurrings.length} recurring transactions.`);
  } catch (err) {
    console.error('Error processing recurring transactions:', err);
  }
}

module.exports = { processRecurringTransactions };
