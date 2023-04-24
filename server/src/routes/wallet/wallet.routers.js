const express = require("express");

const { httpCreatePayment } = require("./wallet.controller");

const walletRouter = express.Router();

walletRouter.post("/wallets/deposit/:coachId", httpCreatePayment);


module.exports = walletRouter;
