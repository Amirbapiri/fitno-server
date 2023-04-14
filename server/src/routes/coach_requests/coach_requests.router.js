const express = require("express");

const auth = require("../../middleware/auth")
const { httpGetAllRequests, httpGetSingleRequest } = require("./coach_requests.controller");

const coachRequestsRouter = express.Router();

// coachRequestsRouter.post("/send", auth, httpPostSendRequest);
coachRequestsRouter.get("/all", auth, httpGetAllRequests);
coachRequestsRouter.get("/:id", auth, httpGetSingleRequest);


module.exports = coachRequestsRouter;