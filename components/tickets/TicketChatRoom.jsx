"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  Paperclip,
  FileText,
  X,
} from "lucide-react";
import { useSocket } from "@/components/providers/SocketProvider";
import TicketCannedResponses from "@/components/tickets/TicketCannedResponses";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  open: {
    label: "Open",
    color: "text-indigo-700 bg-indigo-50/80 border-indigo-200/60",
    iconColor: "text-indigo-600",
    icon: AlertCircle,
  },
  in_progress: {
    label: "In Progress",
    color: "text-amber-700 bg-amber-50/80 border-amber-200/60",
    iconColor: "text-amber-600",
    icon: Clock,
  },
  resolved: {
    label: "Resolved",
    color: "text-emerald-700 bg-emerald-50/80 border-emerald-200/60",
    iconColor: "text-emerald-600",
    icon: CheckCircle2,
  },
  closed: {
    label: "Closed",
    color: "text-slate-600 bg-slate-100/80 border-slate-200",
    iconColor: "text-slate-500",
    icon: Lock,
  },
};

export default function TicketChatRoom({
  ticket,
  currentUserId,
  isStaff = false,
}) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState(ticket.messages || []);
  const [currentStatus, setCurrentStatus] = useState(ticket.status || "open");
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Internal Staff Note State
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Cloudinary Attachment States
  const [attachment, setAttachment] = useState(null); // { url, name }
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;
    const roomName = `ticket_${ticket._id}`;
    socket.emit("join_room", roomName);

    const handleReceiveMessage = (data) => {
      if (data.ticketId === ticket._id && data.message) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === data.message._id);
          if (exists) return prev;
          return [...prev, data.message];
        });
      }
    };

    const handleStatusUpdate = (data) => {
      if (data.ticketId === ticket._id) {
        setCurrentStatus(data.status);
        toast.success(
          `Ticket status updated to: ${data.status.replace("_", " ")}`
        );
      }
    };

    const handleDisplayTyping = (data) => {
      if (data.ticketId === ticket._id && data.userId !== currentUserId) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    };

    socket.on("receive_ticket_message", handleReceiveMessage);
    socket.on("ticket_status_updated", handleStatusUpdate);
    socket.on("display_typing", handleDisplayTyping);

    return () => {
      socket.emit("leave_room", roomName);
      socket.off("receive_ticket_message", handleReceiveMessage);
      socket.off("ticket_status_updated", handleStatusUpdate);
      socket.off("display_typing", handleDisplayTyping);
    };
  }, [socket, ticket._id, currentUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading file to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadPreset =
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
        "texora_preset_name";
      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "rq7v6b9r";

      formData.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      setAttachment({
        url: data.secure_url,
        name: file.name,
      });
      toast.success("File attached successfully!", { id: toastId });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error(err.message || "Failed to upload file", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsDropdownOpen(false);
    if (updatingStatus || currentStatus === newStatus) return;
    setUpdatingStatus(true);
    const toastId = toast.loading("Updating status...");

    try {
      const res = await fetch(`/api/v1/tickets/${ticket._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setCurrentStatus(newStatus);
      toast.success("Status updated successfully!", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Failed to update status", { id: toastId });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (socket) {
      socket.emit("typing", { ticketId: ticket._id, userId: currentUserId });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (
      (!inputMessage.trim() && !attachment) ||
      sending ||
      currentStatus === "closed"
    )
      return;

    const messagePayload = inputMessage.trim();
    const attachmentUrl = attachment?.url || null;
    const internalFlag = isStaff ? isInternalNote : false;

    setInputMessage("");
    setAttachment(null);
    setIsInternalNote(false);
    setSending(true);

    try {
      const res = await fetch(`/api/v1/tickets/${ticket._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messagePayload,
          attachmentUrl,
          isInternal: internalFlag,
        }),
      });
      const data = await res.json();

      if (data.success && data.message) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === data.message._id);
          if (exists) return prev;
          return [...prev, data.message];
        });
      } else {
        setInputMessage(messagePayload);
        setAttachment({ url: attachmentUrl, name: "Attachment" });
        setIsInternalNote(internalFlag);
      }
    } catch (err) {
      console.error("🔥 Failed to send message:", err);
      setInputMessage(messagePayload);
    } finally {
      setSending(false);
    }
  };

  const isClosed = currentStatus === "closed";
  const CurrentStatusIcon = STATUS_CONFIG[currentStatus].icon;

  return (
    <div className="flex flex-col h-175 bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between z-20">
        <div>
          <h2 className="font-bold text-sm text-slate-900">{ticket.subject}</h2>
          <div className="text-[11px] text-slate-500 capitalize flex items-center gap-1.5 mt-0.5">
            {isTyping ? (
              <span className="text-emerald-600 font-semibold animate-pulse">
                typing...
              </span>
            ) : (
              <>
                <span>Category: {ticket.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>Status: {currentStatus.replace("_", " ")}</span>
              </>
            )}
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={updatingStatus}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all shadow-sm ${STATUS_CONFIG[currentStatus].color}`}
          >
            {updatingStatus ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CurrentStatusIcon className="w-3.5 h-3.5" />
            )}
            <span>{STATUS_CONFIG[currentStatus].label}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`absolute right-0 mt-2 w-48 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-1.5 z-50 transition-all origin-top-right ${isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
          >
            {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => {
              const Icon = config.icon;
              const isSelected = currentStatus === statusKey;
              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => handleStatusChange(statusKey)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold ${isSelected ? "bg-slate-50 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    <span>{config.label}</span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 z-10">
        {messages.map((msg, index) => {
          const senderId = msg.senderId?._id || msg.senderId;
          const isMe = senderId?.toString() === currentUserId?.toString();

          // Filter out internal notes for non-staff users
          if (msg.isInternal && !isStaff && !isMe) return null;

          return (
            <div
              key={msg._id || index}
              className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {msg.senderId?.name?.[0]?.toUpperCase() || "U"}
              </div>

              <div
                className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.isInternal
                    ? "bg-amber-50 border border-amber-200 text-amber-900 w-full"
                    : isMe
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-2xs"
                }`}
              >
                {msg.isInternal && (
                  <span className="block font-bold text-[10px] text-amber-600 uppercase tracking-wider mb-1">
                    🔒 Internal Staff Note
                  </span>
                )}

                {msg.message && (
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                )}

                {/* Render Cloudinary Attachment */}
                {msg.attachmentUrl && (
                  <div
                    className={`mt-2 ${msg.message ? "pt-2 border-t border-white/20" : ""}`}
                  >
                    {msg.attachmentUrl.match(
                      /\.(jpeg|jpg|gif|png|webp|avif)$/i
                    ) ? (
                      <a
                        href={msg.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={msg.attachmentUrl}
                          alt="Attachment"
                          className="max-h-48 rounded-xl object-cover hover:opacity-95 transition"
                        />
                      </a>
                    ) : (
                      <a
                        href={msg.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-medium ${
                          msg.isInternal
                            ? "border-amber-300 bg-amber-100/50 text-amber-900"
                            : isMe
                              ? "border-indigo-400 bg-indigo-700/50 text-white"
                              : "border-slate-200 bg-slate-50 text-indigo-600"
                        }`}
                      >
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate underline">
                          View Attached File
                        </span>
                      </a>
                    )}
                  </div>
                )}

                <span
                  className={`block text-[9px] mt-1 text-right ${
                    msg.isInternal
                      ? "text-amber-700/70"
                      : isMe
                        ? "text-indigo-200"
                        : "text-slate-400"
                  }`}
                >
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                </span>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
            Opposite person is typing...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form with Canned Responses & Internal Notes Toggle */}
      {isClosed ? (
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
          <Lock className="h-4 w-4 text-slate-400" />
          <span>This ticket is closed. Messaging is locked.</span>
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2"
        >
          {/* Canned Responses for Staff */}
          {isStaff && (
            <TicketCannedResponses
              onSelect={(macroText) => setInputMessage(macroText)}
            />
          )}

          {/* Active Attachment Preview Banner */}
          {attachment && (
            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl text-xs text-indigo-900">
              <div className="flex items-center gap-2 truncate">
                <Paperclip className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate font-medium">{attachment.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="p-1 hover:bg-indigo-100 rounded-full transition text-indigo-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Attach file"
              className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              ) : (
                <Paperclip className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder={
                isInternalNote
                  ? "Type a private staff note..."
                  : "Type your message or attach a file..."
              }
              className={`flex-1 border rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none transition-all ${
                isInternalNote
                  ? "bg-amber-50/50 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                  : "bg-slate-50/50 border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />

            <button
              type="submit"
              disabled={sending || (!inputMessage.trim() && !attachment)}
              className={`px-6 py-3 rounded-2xl text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:active:scale-100 ${
                isInternalNote
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
              }`}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isInternalNote ? "Note" : "Send"}</span>
            </button>
          </div>

          {/* Internal Staff Note Checkbox Toolbar */}
          {isStaff && (
            <div className="flex items-center justify-between pt-1 px-1">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                />
                <span>Private Staff Note</span>
              </label>
              {isInternalNote && (
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Hidden from customer view
                </span>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
