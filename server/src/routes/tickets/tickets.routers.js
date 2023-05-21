const express = require("express");
const ticketsRouter = express.Router();

const auth = require("./../../middleware/auth");
const { httpSubmitNewTicket, httpCloseTicket, httpUpdateTicket, httpGetAllTicketsByCoachId, httpGetTicketById } = require("./../tickets/tickets.controllers");


ticketsRouter.get("/:ticketId", auth, httpGetTicketById);
ticketsRouter.put("/:ticketId/close", auth, httpCloseTicket);
ticketsRouter.post("/submit", auth, httpSubmitNewTicket);
ticketsRouter.put("/:ticketId/update", auth, httpUpdateTicket);
ticketsRouter.get("/:coachId/all", auth, httpGetAllTicketsByCoachId);


module.exports = ticketsRouter; 
