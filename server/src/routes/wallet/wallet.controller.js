const mongoose = require("mongoose");
const axios = require("axios");

const { Coach }= require("../../models/coaches.mongo");
const Client = require("../../models/clients/clients.mongo");
const { Transaction } = require("../../models/wallet/transactions.mongo");


const httpCreatePayment = async (req, res) => {
  const { coachId } = req.params;
  const { amount } = req.body;
  // check if coach exists or not
  // if exists, process transaction
  // add transaction to coach's wallet transctions
  // update coach's wallet balance
}


const verifyPayment = async (authority, amount) => {}

module.exports = {
  httpCreatePayment,
}
