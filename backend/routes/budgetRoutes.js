const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget
} = require('../controllers/budgetController');

router.route('/')
    .get(protect, getBudgets)
    .post(protect, createBudget);

router.route('/:id')
    .get(protect, getBudget)
    .put(protect, updateBudget)
    .delete(protect, deleteBudget);

module.exports = router; 