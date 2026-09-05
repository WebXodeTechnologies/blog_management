import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb/db";
import { Ticket } from "@/modules/tickets";
import { User } from "@/modules/users/user.model";
import { verifyUserRequest } from "@/modules/rbac/rbac.guard";
import TicketChatRoom from "@/components/tickets/TicketChatRoom";
import TicketAssignmentPanel from "@/components/tickets/TicketAssignmentPanel";
import CreateTicketForm from "@/components/tickets/CreateTicketForm";

export default async function TicketDetailPage({ params }) {
  const { id } = await params;

  const guard = await verifyUserRequest();
  if (!guard.authorized) {
    return notFound();
  }

  const serializedUser = {
    _id: guard.user._id?.toString(),
    name: guard.user.name,
    email: guard.user.email,
    role: guard.user.role?.toLowerCase(), // Normalize role check
    avatar: guard.user.avatar,
    tenantId: guard.user.tenantId?.toString(),
  };

  if (id === "new") {
    return (
      <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading font-bold text-xl text-slate-900">
            Create Support Ticket
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Open a new dispute or assistance request
          </p>
        </div>
        <CreateTicketForm user={serializedUser} />
      </div>
    );
  }

  await connectDB();
  const ticketDoc = await Ticket.findById(id)
    .populate("creatorId assignedTo", "name email avatar role")
    .lean();

  if (!ticketDoc) {
    return notFound();
  }

  const isStaff =
    serializedUser.role === "admin" || serializedUser.role === "staff";

  let serializedStaffList = [];
  if (isStaff) {
    const staffDocs = await User.find({
      role: { $in: ["admin", "staff", "Admin", "Staff"] },
    })
      .select("name email role avatar")
      .lean();

    serializedStaffList = staffDocs.map((staff) => ({
      ...staff,
      _id: staff._id.toString(),
    }));
  }

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
    tenantId: ticketDoc.tenantId.toString(),
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
          Support & Dispute Resolution
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Secure real-time communication channel
        </p>
      </div>

      {isStaff && (
        <TicketAssignmentPanel
          ticketId={ticket._id}
          staffList={serializedStaffList}
          currentAssigned={ticket.assignedTo}
        />
      )}

      <TicketChatRoom
        ticket={ticket}
        currentUserId={serializedUser._id}
        isStaff={isStaff}
      />
    </div>
  );
}
