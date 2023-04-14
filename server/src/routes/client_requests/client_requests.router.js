const express = require("express");

const auth = require("../../middleware/auth")
const { httpPostSendRequest, httpGetAllRequests } = require("./client_requests.controller");


const clientRequestsRouter = express.Router();

clientRequestsRouter.post("/send", auth, httpPostSendRequest);
clientRequestsRouter.get("/all", auth, httpGetAllRequests);


module.exports = clientRequestsRouter;