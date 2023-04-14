const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const Plan = require("./../../models/plans/plans.mongo");

const httpPostSendTrainingPlan = async (req, res) => {
  const tempPath = req.file.path;
  const buffer = await sharp(tempPath).toBuffer();
  const multerFinalPath = path.join(__dirname, `../../${process.env.MULTER_PLAN_FINAL_PATH}`);
  const multerSaveTo = `${multerFinalPath}/${req.body["code"]}.png`;

  try {
    const { code, client, coach } = req.body;
    // Creating new plan object
    const plan = await new Plan({
      code: code,
      client: client,
      coach: coach,
      trainingPlan: buffer,
    }).save();
    if (plan) {
      fs.rename(tempPath, multerSaveTo, (err) => {
        if (err) throw err;
        const planObject = plan.toObject();
        delete planObject.trainingPlan;
        delete planObject.dietPlan;
        return res.status(201).json({ planObject });
      });
    }
  } catch (e) {
    return res.status(400).json(e);
  }
}


module.exports = {
  httpPostSendTrainingPlan,
}