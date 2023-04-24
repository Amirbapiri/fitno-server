const path = require("path");

const express = require("express");
const multer = require("multer");

require("dotenv").config();

const {
  httpGetAllCoaches,
  httpPostCoachSignup,
  httpPostCoachSignIn,
  httpCheckIfTokenIsValid,
  httpGetUserData,
  httpUpdateUserData,
  httpPostCoachSignOut,
  httpUpdateUserAvatar,
  httpGetMyAvatar,
  httpDeleteMyAvatar,
} = require("./coaches.controller");
const auth = require("../../middleware/auth");
const coachRequestsRouter = require("./../coach_requests/coach_requests.router");

const coachesRouter = express.Router();

const uploadMiddleWare = multer({   
  dest: path.join(__dirname, `../../${process.env.MULTER_TEMP_PATH}`),
});


coachesRouter.get("/", auth, httpGetAllCoaches);
coachesRouter.get("/profile", auth, httpGetUserData);
coachesRouter.patch("/profile", auth, httpUpdateUserData);
coachesRouter.post("/auth/signup", httpPostCoachSignup);
coachesRouter.post("/auth/sign-in", httpPostCoachSignIn);
coachesRouter.post("/auth/verification", httpCheckIfTokenIsValid);
coachesRouter.post("/auth/sign-out", auth, httpPostCoachSignOut);
coachesRouter.put("/avatar", auth, uploadMiddleWare.single("avatar"), httpUpdateUserAvatar);
coachesRouter.get("/avatar/:id/", httpGetMyAvatar);
coachesRouter.delete("/avatar/me/delete", auth, httpDeleteMyAvatar);

// Requests
coachesRouter.use("/requests", coachRequestsRouter);

module.exports = coachesRouter;
