const express = require("express");

const coachesRouter = require("./coaches/coaches.routers");
const clientsRouter = require("./clients/clients.routers");
const plansRouter = require("./plans/plans.router");
const clientRequestsRouter = require("./client_requests/client_requests.router");
const ticketsRouter = require("./tickets/tickets.routers");
const exercisesRouter = require("./exercises/exercises_routes");

const api = express.Router();

api.use("/coaches", coachesRouter);
api.use("/clients", clientsRouter);
api.use("/requests", clientRequestsRouter);
api.use("/plans", plansRouter);
api.use("/tickets", ticketsRouter);
api.use("/exercises", exercisesRouter);


module.exports = {
  api_v1: api,
}
