import { Ticket } from "./ticket.model";
import "@/modules/tenants/tenant.model";

export class TicketRepository {
  async create(ticketData) {
    const ticket = await Ticket.create(ticketData);
    return await ticket.populate("creatorId tenantId");
  }

  async findById(ticketId) {
    return await Ticket.findById(ticketId)
      .populate("creatorId assignedTo tenantId", "name email avatar role")
      .lean();
  }

  async findByTenant(tenantId, query = { tenantId }) {
    return await Ticket.find(query)
      .populate("creatorId assignedTo tenantId", "name email avatar role")
      .sort({ createdAt: -1 })
      .lean();
  }

  async findAllForStaff() {
    return await Ticket.find({})
      .populate("creatorId assignedTo tenantId", "name email avatar role")
      .sort({ updatedAt: -1 })
      .lean();
  }

  async addMessage(ticketId, senderId, messageText) {
    return await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: { messages: { senderId, message: messageText } },
        $set: { updatedAt: new Date() },
      },
      { new: true, returnDocument: "after" }
    ).populate(
      "messages.senderId creatorId assignedTo tenantId",
      "name email avatar role"
    );
  }

  async updateStatus(ticketId, status) {
    return await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: { status, updatedAt: new Date() } },
      { new: true, returnDocument: "after" }
    ).populate("creatorId assignedTo tenantId", "name email avatar role");
  }
  // Add to TicketRepository
  async assignAgent(ticketId, agentId) {
    return await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: { assignedTo: agentId || null, updatedAt: new Date() } },
      { new: true, returnDocument: "after" }
    ).populate("creatorId assignedTo tenantId", "name email avatar role");
  }

  // Add to TicketService
  async assignTicket(io, ticketId, agentId, userId) {
    const updatedTicket = await this.ticketRepo.assignAgent(ticketId, agentId);

    if (io) {
      io.to(`ticket_${ticketId}`).emit("ticket_assigned", {
        ticketId,
        assignedTo: updatedTicket.assignedTo,
        assignedBy: userId,
      });
    }

    return updatedTicket;
  }

  async addMessage(
    ticketId,
    senderId,
    text,
    attachmentUrl = null,
    isInternal = false
  ) {
    return await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          messages: {
            senderId,
            text,
            attachmentUrl,
            isInternal,
            createdAt: new Date(),
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("messages.senderId", "name email avatar role");
  }
  async findByTenant(
    tenantId,
    { search = "", page = 1, limit = 10, status, priority } = {}
  ) {
    const query = { tenantId };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .populate("creatorId assignedTo", "name email avatar role")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Ticket.countDocuments(query),
    ]);

    return {
      tickets,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      totalTickets: total,
    };
  }

  async getMetrics(tenantId) {
    const matchQuery = tenantId ? { tenantId } : {};

    const stats = await Ticket.aggregate([
      { $match: matchQuery },
      {
        $facet: {
          totalTickets: [{ $count: "count" }],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          byPriority: [{ $group: { _id: "$priority", count: { $sum: 1 } } }],
        },
      },
    ]);

    return stats[0];
  }
}
