const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const recurringController = require('../controllers/recurringController');
const { processRecurringTransactions } = require('../utils/recurringProcessor');

// Create
router.post('/', auth, recurringController.createRecurring);

// Read all for user
router.get('/', auth, recurringController.getRecurringTransactions);

// Update by id
router.put('/:id', auth, recurringController.updateRecurring);

// Delete by id
router.delete('/:id', auth, recurringController.deleteRecurring);

// Optional manual trigger route
router.post('/trigger', auth, async (req, res) => {
  try {
    await processRecurringTransactions();
    res.json({ message: 'Recurring transactions processed manually.' });
  } catch (error) {
    console.error('Error processing recurring transactions:', error);
    res.status(500).json({ error: 'Processing failed.' });
  }
});

module.exports = router;
