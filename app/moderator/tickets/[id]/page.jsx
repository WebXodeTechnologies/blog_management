import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb/db";
import { TicketRepository } from "@/modules/tickets";
import { verifyModeratorRequest } from "@/modules/rbac/rbac.guard";
import TicketChatRoom from "@/components/tickets/TicketChatRoom";

export default async function ModeratorTicketDetailPage({ params }) {
  const { id } = await params;

  const guard = await verifyModeratorRequest();
  if (!guard.authorized) {
    return notFound();
  }

  await connectDB();
  const ticketRepo = new TicketRepository();
  const ticketDoc = await ticketRepo.findById(id);

  if (!ticketDoc) {
    return notFound();
  }

  // Serialize Mongoose data for client component
  const ticket = {
    ...ticketDoc,
    _id: ticketDoc._id.toString(),
    creatorId: ticketDoc.creatorId?._id
      ? {
          ...ticketDoc.creatorId,
          _id: ticketDoc.creatorId._id.toString(),
        }
      : ticketDoc.creatorId?.toString(),
    assignedTo: ticketDoc.assignedTo?._id
      ? {
          ...ticketDoc.assignedTo,
          _id: ticketDoc.assignedTo._id.toString(),
        }
      : ticketDoc.assignedTo?.toString(),
    tenantId: ticketDoc.tenantId?._id
      ? ticketDoc.tenantId._id.toString()
      : ticketDoc.tenantId?.toString(),
    createdAt: ticketDoc.createdAt?.toISOString(),
    updatedAt: ticketDoc.updatedAt?.toISOString(),
    messages: ticketDoc.messages.map((m) => ({
      ...m,
      _id: m._id.toString(),
      senderId: m.senderId?._id
        ? {
            ...m.senderId,
            _id: m.senderId._id.toString(),
          }
        : m.senderId?.toString(),
      createdAt: m.createdAt?.toISOString(),
    })),
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-slate-900">
          Moderator Ticket Command
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Live dispute management and response channel
        </p>
      </div>
      <TicketChatRoom
        ticket={ticket}
        currentUserId={guard.user._id.toString()}
      />
    </div>
  );
}
