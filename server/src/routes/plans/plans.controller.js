const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const {Plan, Exercise} = require("./../../models/plans/plans.mongo");
const Request = require("./../../models/requests/requests.mongo");

// const httpPostSendTrainingPlan = async (req, res) => {
//   const tempPath = req.file.path;
//   const buffer = await sharp(tempPath).toBuffer();
//   const multerFinalPath = path.join(__dirname, `../../${process.env.MULTER_PLAN_FINAL_PATH}`);
//   const multerSaveTo = `${multerFinalPath}/${req.body["code"]}.png`;

//   try {
//     const { code, client, coach } = req.body;
//     // Creating new plan object
//     const plan = await new Plan({
//       code: code,
//       client: client,
//       coach: coach,
//       trainingPlan: buffer,
//     }).save();
//     if (plan) {
//       fs.rename(tempPath, multerSaveTo, (err) => {
//         if (err) throw err;
//         const planObject = plan.toObject();
//         delete planObject.trainingPlan;
//         delete planObject.dietPlan;
//         return res.status(201).json({ planObject });
//       });
//     }
//   } catch (e) {
//     return res.status(400).json(e);
//   }
// }

const httpCreateWorkoutPlan = async (req, res) => {
  const { workoutPlanName, description, trainingSystem, days } = req.body;
  
  try {
    const planData = { workoutPlanName, description, trainingSystem, days };
    const plan = await Plan.createPlan(planData, req.params.requestId);

    for (const day of days) {
      const { exercises } = day;

      // create an array of Exercise objects
      const exerciseObj = exercises.map((exercise) => new Exercise(exercise));

      // Updating corresponding day object in the Plan model with the Exercise objects
      await Plan.findOneAndUpdate(
        { _id: plan._id, "days.dayOfWeek": day.dayOfWeek },
        { $set: { "days.$.exercises" : exerciseObj } },
        { new: true },
      );
    }
    res.status(201).json({ message: "Plan created successfully"});
  } catch (err) {
    res.status(500).json({ message: "Error creating plan", error: err.message });
  }
};


const httpGetWorkoutPlan = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const request = await Request.findById(requestId);
    if(!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const plan = await Plan.findOne({ request: requestId });
    if(!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch(err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

const httpDeletePlanById = async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete(req.params.planId);
    if(!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(204).json({});
  } catch(err) {
    res.status(500).json({ message: "Error in deleting plan", message: err.message });
  }
}

module.exports = {
  httpCreateWorkoutPlan,
  httpGetWorkoutPlan,
  httpDeletePlanById,
}
