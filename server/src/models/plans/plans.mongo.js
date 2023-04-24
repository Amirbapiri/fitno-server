const mongoose = require("mongoose");

const Request = require("./../requests/requests.mongo");


const exerciseSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true },
  reps: { type: Number, required: true },
  sets: { type: Number, required: true },
  description: { type: String },
  trainingSystem: { type: String, required: true }, // Add a field for training system
});

const planSchema = new mongoose.Schema({
  workoutPlanName: { type: String, required: true },
  description: { type: String },
  trainingSystem: { type: String, required: true }, // Add a field for training system
  request: {type: mongoose.Schema.Types.ObjectId, ref: "Request"},
  days: [{
    dayOfWeek: { type: String, required: true },
    exercises: { type: [exerciseSchema], required: true }
  }]
});

// const planSchema = new mongoose.Schema({
//   workoutPlanName: { type: String, required: true },
//   description: { type: String },
//   trainingSystem: { type: String, required: true },
//   request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
//   days: [
//     {
//       dayOfWeek: { type: String, required: true },
//       exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
//     },
//   ],
// });

planSchema.statics.createPlan = async function (planData, requestId) {
  try {
    const request = await Request.findById(requestId);
    if(!request) {
      throw new Error("Request not found");
    }
    const plan = new this(planData);
    plan.request = request;
    await plan.save();
    return plan;

  } catch(err) {
    throw new Error("Error in creating plan: " + err.message);
  }
}

const Plan = mongoose.model("Plan", planSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = {
  Plan,
  Exercise,
};

