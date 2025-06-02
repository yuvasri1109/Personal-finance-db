const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const recurringRoutes = require('./routes/recurringRoutes');
const savingsRoutes = require('./routes/savingsRoutes');

const cron = require('node-cron');
const { processRecurringTransactions } = require('./utils/recurringProcessor');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/savings', savingsRoutes);

// Mongoose config to suppress strictQuery warnings (optional)
mongoose.set('strictQuery', false);

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/finance-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');

  app.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Schedule cron job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Running scheduled recurring transaction processor...');
  try {
    await processRecurringTransactions();
    console.log('✅ Recurring transactions processed successfully.');
  } catch (error) {
    console.error('❌ Error in recurring transaction processor:', error);
  }
});
