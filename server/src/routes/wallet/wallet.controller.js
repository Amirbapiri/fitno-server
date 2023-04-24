const mongoose = require("mongoose");
const axios = require("axios");

const { Coach }= require("../../models/coaches.mongo");
const Client = require("../../models/clients/clients.mongo");
const { Transaction } = require("../../models/wallet/transactions.mongo");


// const httpCreatePaymentOld = async (req, res) => {
//   const { coachId } = req.params;
//   const { amount } = req.body;
//   
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const coach = await Coach.findByIdAndUpdate(
//       { _id: coachId },
//       { $inc: { "wallet.balance": amount } },
//       { new: true, session }
//     );
//     if(!coach) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({"message": "Coach not found"});
//     }
//     
//     // Create a new transaction record
//     const transaction = new Transaction({
//       payer: req.user,
//       payee: coach._id,
//       amount: amount,
//       type: "deposit",
//       date: new Date(),
//     })
//     await transaction.save({ session });

//     // add the transaction to the coach's wallet:
//     coach.wallet.transactions.push(transaction._id);
//     await coach.wallet.save();

//     
//     await session.commitTransaction();
//     session.endSession();
//     
//     res.status(200).json({"message": "Deposit successful"});

//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({"message": "Deposit failed"});
//   }
// }

const httpCreatePayment = async (req, res) => {
  const { coachId } = req.params;
  const { amount } = req.body;

  try {
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const response = await axios.post(
        "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
        {
          MerchantID: process.env.ZARINPAL_MERCHANT_ID,
          Amount: amount,
          Description: "Payment for coaching services",
          CallbackURL: `http://localhost:3000/api/wallets/${coachId}/payments/verify`,
        }
      );
      if (response.data.Status !== 100) {
        throw new Error("Payment failed");
      }
      const transaction = new Transaction({
        payer: req.user,
        payee: coach._id,
        amount: amount,
        type: "deposit",
        zarinpalAuthority: response.data.Authority,
      });
      coach.wallet.transactions.push(transaction);
      coach.wallet.balance += amount;

      await transaction.save({ session });
      await coach.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Payment successful" });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      res.status(500).json({ message: "Payment failed" });
    }
  } catch (err) { 
    res.status(500).json({ message: "Server error" }); 
  }
}


const verifyPayment = async (authority, amount) => {
  try {
    const response = await zarinpalCheckout.PaymentVerification({
      MerchantID: MerchantID,
      Amount: amount,
      Authority: authority,
    });
    if(response.Status == 100) {
      return response.RefID;
    } else {
      return null;
    }
  } catch(err) {
    return null;
  }
}

module.exports = {
  httpCreatePayment,
  // httpCreatePaymentOld,
}
