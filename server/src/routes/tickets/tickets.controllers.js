const express = require('express');
const router = express.Router();
const Ticket = require('../../models/tickets/tickets.mongo');


const httpSubmitNewTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    const coach = req.user; // assuming the coach's user ID is stored in req.user

    const ticket = await Ticket.createTicket(coach, subject, description, priority);
    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Error creating ticket', error: err.message });
  }
};

const httpCloseTicket = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const ticket = await Ticket.closeTicket(ticketId);
    return res.status(200).json(ticket);
  } catch (err) {
    return res.status(500).json({ message: "Error closing ticket", error: err.message });
  }
};

const httpUpdateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { priority, subject, description } = req.body;

  try {
    const updatedTicket = await Ticket.updateTicket(ticketId, {
      priority,
      subject,
      description,
    });
    return res.status(204).json();
  } catch(err) {
    return res.status(400).json({ message: "Error updating ticket" });
  }
}

const httpGetAllTicketsByCoachId = async (req, res) => {
  const { coachId } = req.params;
  try {
    const tickets = await Ticket.getAllTicketsByCoachId(coachId);
    res.json(tickets);
  } catch(err) {
    return res.status(400).json({message: err.message})
  }
}

const httpGetTicketById = async (req, res) => {
  const { ticketId } = req.params;
  try{
    const ticket = await Ticket.findOne({_id: ticketId});
    return res.json(ticket);
  } catch (err) {
    return res.status(404).json({message: err.message});
  }
}

module.exports = {
  httpSubmitNewTicket,
  httpCloseTicket,
  httpUpdateTicket,
  httpGetAllTicketsByCoachId,
  httpGetTicketById,
}
