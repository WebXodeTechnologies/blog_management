import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb/db";
import { TicketRepository } from "@/modules/tickets";
import { User } from "@/modules/users/user.model";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import TicketChatRoom from "@/components/tickets/TicketChatRoom";
import TicketAssignmentPanel from "@/components/tickets/TicketAssignmentPanel";

export default async function AdminTicketDetailPage({ params }) {
  const { id } = await params;

  const guard = await verifyAdminRequest();
  if (!guard.authorized) {
    return notFound();
  }

  await connectDB();
  const ticketRepo = new TicketRepository();
  const ticketDoc = await ticketRepo.findById(id);

  if (!ticketDoc) {
    return notFound();
  }

  // Fetch staff and admin list for the assignment panel
  const staffDocs = await User.find({
    role: { $in: ["admin", "staff", "Admin", "Staff"] },
  })
    .select("name email role avatar")
    .lean();

  const serializedStaffList = staffDocs.map((staff) => ({
    ...staff,
    _id: staff._id.toString(),
  }));

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
          Platform Admin Ticket Command
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Global oversight and intervention channel
        </p>
      </div>

      <TicketAssignmentPanel
        ticketId={ticket._id}
        staffList={serializedStaffList}
        currentAssigned={ticket.assignedTo}
      />

      <TicketChatRoom
        ticket={ticket}
        currentUserId={guard.user._id.toString()}
        isStaff={true}
      />
    </div>
  );
}
