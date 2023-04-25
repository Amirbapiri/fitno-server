const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true,
  },
}, { timestamps: true });

ticketSchema.statics.createTicket = async function (coachId, subject, description, priority) {
  const Ticket = this;
  try {
    const ticket = new Ticket({
      coach: coachId,
      subject,
      description,
      priority,
    });
    await ticket.save();
    return ticket;
  } catch (err) {
    throw new Error('Error creating ticket');
  }
};

ticketSchema.statics.closeTicket = async function (ticketId) {
  const Ticket = this;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.status = "Closed";
    await ticket.save();
    return ticket;
  } catch (err) {
    throw new Error("Error closing ticket");
  }
};

ticketSchema.statics.updateTicket = async function(ticketId, updates) {
  const Ticket = this;
  const allowedUpdates = ["subject", "description", "priority"];
  const updatesKeys = Object.keys(allowedUpdates);
  const isValidUpdate = updatesKeys.every((update) => allowedUpdates.includes(update));
  
  if(!isValidUpdate) {
    throw new Error("Invalid update(s)");
  }
  try {
    const ticket = await Ticket.findOneAndUpdate({ _id: ticketId }, updates, { new: true });
    return ticket;
  } catch(err) {
    throw new Error("Error updating ticket");
  }
}

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
