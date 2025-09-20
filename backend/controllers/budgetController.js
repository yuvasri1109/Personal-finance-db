const Budget = require('../models/budgetModel');

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
    try {
        const { category, amount, period, endDate } = req.body;

        const budget = await Budget.create({
            user: req.user._id,
            category,
            amount,
            period,
            endDate
        });

        res.status(201).json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id });
        res.json(budgets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
const getBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Check for user
        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Check for user
        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Check for user
        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await budget.remove();
        res.json({ message: 'Budget removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget
}; 