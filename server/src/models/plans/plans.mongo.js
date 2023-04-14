const mongoose = require("mongoose");

const plansSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coach",
  },
  trainingPlan: {
    type: Buffer,
  },
  dietPlan: {
    type: Buffer,
  },
  isDone: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Plan = mongoose.model("Plan", plansSchema);

module.exports = Plan;