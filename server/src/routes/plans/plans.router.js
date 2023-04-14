const path = require("path");

const express = require("express");
const multer = require("multer");

const auth = require("./../../middleware/auth");
const { httpPostSendTrainingPlan } = require("./plans.controller");

const plansRouter = express.Router();


const uploadMiddleWare = multer({
    dest: path.join(__dirname, `../../${process.env.MULTER_PLAN_TEMP_PATH}`),
});


plansRouter.post("/training/send", auth, uploadMiddleWare.single("trainingPlan"), httpPostSendTrainingPlan);

module.exports = plansRouter;