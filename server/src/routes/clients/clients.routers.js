const path = require("path");

const express = require("express");
const multer = require("multer");

const auth = require("../../middleware/auth");
const {
    httpPostClientSignUp,
    httpPostClientSignIn,
    httpCheckIfTokenIsValid,
    httpGetUserData,
    httpUpdateUserProfile,
    httpUpdateUserAvatar,
    httpGetMyAvatar,
    httpDeleteMyAvatar,
    httpPostClientSignOut,
} = require("./client.controller");
const clientRequestsRouter = require("./../client_requests/client_requests.router");


const clientsRouter = express.Router();

const uploadMiddleWare = multer({   
    dest: path.join(__dirname, `../../${process.env.MULTER_TEMP_PATH}`),
});

clientsRouter.post("/auth/signup", httpPostClientSignUp);
clientsRouter.post("/auth/sign-in", httpPostClientSignIn);
clientsRouter.post("/auth/verification", httpCheckIfTokenIsValid);
clientsRouter.get("/profile", auth, httpGetUserData);
clientsRouter.patch("/profile", auth, httpUpdateUserProfile);
clientsRouter.put("/avatar", auth, uploadMiddleWare.single("avatar"), httpUpdateUserAvatar);
clientsRouter.get("/avatar/:id/", httpGetMyAvatar);
clientsRouter.delete("/avatar/me/delete", auth, httpDeleteMyAvatar);
clientsRouter.post("/auth/sign-out", auth, httpPostClientSignOut);

// requests
clientsRouter.use("/requests", clientRequestsRouter);

module.exports = clientsRouter;
