const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a budget amount']
    },
    period: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date,
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Budget', budgetSchema); 