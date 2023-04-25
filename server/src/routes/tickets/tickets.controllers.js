const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');


const httpSubmitNewTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    const coach = req.user._id; // assuming the coach's user ID is stored in req.user

    const ticket = await Ticket.createTicket(subject, description, priority, coach);
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

module.exports = {
  httpSubmitNewTicket,
  httpCloseTicket,
  httpUpdateTicket,
}
