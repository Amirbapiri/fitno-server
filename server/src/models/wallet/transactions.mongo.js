const mongoose = require("mongoose");


const walletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
});


const transactionSchema = new mongoose.Schema({
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['payment', 'withdrawal'],
    required: true,
  },
});

const coachWithdrawalRequestSchema = new mongoose.Schema({
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected'],
    default: 'requested'
  },
  dateRequested: {
    type: Date,
    default: Date.now
  },
  dateProcessed: {
    type: Date
  }
});


const Wallet = mongoose.model('Wallet', walletSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const CoachWithdrawalRequest = mongoose.model('CoachWithdrawalRequest', coachWithdrawalRequestSchema);


module.exports = {
  Wallet,
  Transaction,
  CoachWithdrawalRequest,
}
