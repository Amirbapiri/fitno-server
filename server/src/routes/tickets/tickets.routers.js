const express = require('express');
const ticketsRouter = express.Router();

const { auth } = require("./../../middleware/auth");
const { httpSubmitNewTicket, httpCloseTicket } = require("./../tickets/tickets.controllers");


ticketsRouter.post("/submit", auth, httpSubmitNewTicket);
ticketsRouter.post("/close/:ticketId", auth, httpCloseTicket);
ticketsRouter.put("/:ticketId/update", auth, httpUpdateTicket);


module.exports = ticketsRouter; 
