const express = require("express");

const coachesRouter = require("./coaches/coaches.routers");
const clientsRouter = require("./clients/clients.routers");
const plansRouter = require("./plans/plans.router");
// const clientRequestsRouter = require("./requests/requests.router");

const api = express.Router();

api.use("/coaches", coachesRouter);
api.use("/clients", clientsRouter);
api.use("/plans", plansRouter);

module.exports = {
  api_v1: api,
}