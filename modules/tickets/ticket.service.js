import { TicketRepository } from "./ticket.repository";
import { sendTicketNotification } from "@/lib/mail";

export class TicketService {
  constructor() {
    this.ticketRepo = new TicketRepository();
  }

  async getTenantTickets(tenantId, query) {
    return await this.ticketRepo.findByTenant(tenantId, query);
  }

  async createTicket(data) {
    const ticket = await this.ticketRepo.create(data);

    if (ticket.assignedTo) {
      const agentEmail = ticket.assignedTo?.email;
      if (agentEmail) {
        await sendTicketNotification({
          to: agentEmail,
          subject: `New Ticket Assigned: ${ticket.subject}`,
          message: `You have been assigned a new ${ticket.priority || "medium"} priority ticket.`,
        });
      }
    }

    return ticket;
  }

  async postMessage(io, ticketId, senderId, messageText, attachmentUrl) {
    const updatedTicket = await this.ticketRepo.addMessage(
      ticketId,
      senderId,
      messageText,
      attachmentUrl
    );

    if (io) {
      io.to(`ticket_${ticketId}`).emit("receive_ticket_message", {
        ticketId,
        message: updatedTicket.messages[updatedTicket.messages.length - 1],
      });
    }

    return updatedTicket;
  }

  async updateStatus(io, ticketId, status, userId) {
    const updatedTicket = await this.ticketRepo.updateStatus(ticketId, status);

    if (io) {
      io.to(`ticket_${ticketId}`).emit("ticket_status_updated", {
        ticketId,
        status,
        updatedBy: userId,
      });
    }

    return updatedTicket;
  }

  async assignTicket(io, ticketId, agentId, userId) {
    const updatedTicket = await this.ticketRepo.assignAgent(ticketId, agentId);

    if (io) {
      io.to(`ticket_${ticketId}`).emit("ticket_assigned", {
        ticketId,
        assignedTo: updatedTicket.assignedTo,
        assignedBy: userId,
      });
    }

    if (updatedTicket.assignedTo?.email) {
      await sendTicketNotification({
        to: updatedTicket.assignedTo.email,
        subject: `Ticket Assignment Update`,
        message: `You have been assigned to ticket: "${updatedTicket.subject}".`,
      });
    }

    return updatedTicket;
  }
}
