const path = require("path");

const express = require("express");
const multer = require("multer");

const auth = require("./../../middleware/auth");
const { httpCreateWorkoutPlan, httpGetWorkoutPlan, httpDeletePlanById } = require("./plans.controller");

const plansRouter = express.Router();


const uploadMiddleWare = multer({
    dest: path.join(__dirname, `../../${process.env.MULTER_PLAN_TEMP_PATH}`),
});


plansRouter.get("/:requestId", auth, httpGetWorkoutPlan);
plansRouter.post("/:requestId/create", auth, httpCreateWorkoutPlan);
plansRouter.get("/:planId/delete", auth, httpDeletePlanById);

module.exports = plansRouter;

