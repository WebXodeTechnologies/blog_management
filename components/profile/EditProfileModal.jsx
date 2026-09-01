"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Camera,
  Trash2,
  Lock,
  User,
  Phone,
  Mail,
  FileText,
  Sparkles,
  Upload,
  RotateCw,
  ZoomIn,
  Check,
  Save,
  Globe,
  RefreshCw,
  Share2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

const PRONOUN_OPTIONS = [
  "he/him/his",
  "she/her/hers",
  "they/them/theirs",
  "other",
];

export default function EditProfileModal({ user, onClose, onUpdateSuccess }) {
  const [activeTab, setActiveTab] = useState("identity"); // identity | avatar | socials
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    pronouns: user?.pronouns || "he/him/his",
    customPronouns: "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    socialLinks: {
      twitter: user?.socialLinks?.twitter || "",
      github: user?.socialLinks?.github || "",
      linkedin: user?.socialLinks?.linkedin || "",
      website: user?.socialLinks?.website || "",
      instagram: user?.socialLinks?.instagram || "",
    },
  });

  const [saving, setSaving] = useState(false);

  // Avatar Cropping state
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropRotation, setCropRotation] = useState(0);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Load custom pronouns if user has non-standard pronoun
  useEffect(() => {
    if (user?.pronouns && !PRONOUN_OPTIONS.includes(user.pronouns)) {
      setFormData((prev) => ({
        ...prev,
        pronouns: "other",
        customPronouns: user.pronouns,
      }));
    }
  }, [user]);

  // Handle local file selection for cropper
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setImageToCrop(event.target.result);
        setCropScale(1);
        setCropRotation(0);
      }
    };
    reader.readAsDataURL(file);
  };

  // Render crop canvas preview in real time
  useEffect(() => {
    if (!imageToCrop || !canvasRef.current) return;
    const img = new Image();
    img.src = imageToCrop;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const size = 260;
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);
      ctx.save();

      // Translate to center for scale & rotation
      ctx.translate(size / 2, size / 2);
      ctx.rotate((cropRotation * Math.PI) / 180);
      ctx.scale(cropScale, cropScale);

      // Center crop calculation
      const minDim = Math.min(img.width, img.height);
      ctx.drawImage(
        img,
        (img.width - minDim) / 2,
        (img.height - minDim) / 2,
        minDim,
        minDim,
        -size / 2,
        -size / 2,
        size,
        size
      );

      ctx.restore();
    };
  }, [imageToCrop, cropScale, cropRotation]);

  // Apply Crop and update avatar form data
  const applyCrop = () => {
    if (!canvasRef.current || !imageToCrop) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setFormData((prev) => ({ ...prev, avatar: dataUrl }));
    setImageToCrop(null);
    toast.success("Avatar image cropped & updated!");
  };

  const handleUseGoogleAvatar = () => {
    if (user?.googleAvatar) {
      setFormData((prev) => ({ ...prev, avatar: user.googleAvatar }));
      toast.success("Switched to your Google profile image");
    } else {
      toast.error("No Google profile image available");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const finalPronouns =
      formData.pronouns === "other"
        ? formData.customPronouns.trim() || "they/them"
        : formData.pronouns;

    try {
      const res = await fetch("/api/v1/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          pronouns: finalPronouns,
          bio: formData.bio,
          avatar: formData.avatar,
          socialLinks: formData.socialLinks,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      toast.success("Profile updated successfully!");
      if (onUpdateSuccess) onUpdateSuccess(data.user);
      onClose();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    {
      id: "identity",
      label: "General Profile",
      desc: "Name, phone, pronouns & bio",
      icon: User,
    },
    {
      id: "avatar",
      label: "Avatar & Cropping",
      desc: "Photo upload & crop tool",
      icon: Camera,
    },
    {
      id: "socials",
      label: "Social Links",
      desc: "Connect your public profiles",
      icon: Share2,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xl font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl h-[90vh] md:h-155 bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/80 overflow-hidden flex flex-col md:flex-row"
        >
          {/* Desktop Left Sidebar / Mobile Top Header */}
          <div className="w-full md:w-72 bg-linear-to-b from-slate-50 via-slate-50/90 to-slate-100/50 border-b md:border-b-0 md:border-r border-slate-200/80 p-4 sm:p-6 flex flex-col justify-between shrink-0">
            <div>
              {/* Header Title & Branding */}
              <div className="flex items-center justify-between md:block mb-4 md:mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <h3 className="font-sans font-bold text-base sm:text-lg text-slate-950">
                      Profile Settings
                    </h3>
                  </div>
                  <p className="text-[11px] text-black font-medium hidden md:block">
                    Author &amp; Workspace Identity
                  </p>
                </div>

                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-200/60 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Navigation */}
              <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`relative flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold border border-indigo-500"
                          : "text-slate-700 hover:bg-indigo-50/60 font-semibold"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl transition ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="hidden sm:block">
                        <p
                          className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-900"}`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-[10px] font-medium hidden md:block ${isActive ? "text-indigo-100" : "text-slate-500"}`}
                        >
                          {item.desc}
                        </p>
                      </div>
                      <span
                        className={`sm:hidden text-xs font-bold ${isActive ? "text-white" : "text-slate-900"}`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 text-white ml-auto hidden md:block" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Desktop User Card */}
            <div className="hidden md:flex items-center gap-3 pt-4 border-t border-slate-200/80">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 ring-2 ring-indigo-500/10"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {formData.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-950 truncate">
                  {formData.name || "Author"}
                </p>
                <p className="text-[10px] text-indigo-600 font-semibold capitalize">
                  {user?.role || "Member"} Workspace
                </p>
              </div>
            </div>
          </div>

          {/* Right Main Content & Form Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Modal Top Header Bar */}
            <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-slate-100/90 bg-white">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                  {navItems.find((n) => n.id === activeTab)?.label}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  Press ESC to close
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Form Scrollable Body */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-4 sm:p-6 sm:px-8 space-y-6"
            >
              {/* TAB 1: Profile Identity */}
              {activeTab === "identity" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Full Name & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs text-slate-950 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 font-semibold shadow-2xs transition"
                          required
                          placeholder="e.g. Alex Rivera"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Contact Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <Phone className="h-4 w-4" />
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs text-slate-950 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 font-medium shadow-2xs transition"
                          placeholder="+91-9884489084"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Read-Only Email ID */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        Email Address
                      </label>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/80 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Read-only
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-500 font-mono cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 font-semibold">
                      Email address is tied to your account login and cannot be
                      altered here.
                    </p>
                  </div>

                  {/* Pronoun Choice Chips */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Preferred Pronouns
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {PRONOUN_OPTIONS.map((opt) => {
                        const isSelected = formData.pronouns === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, pronouns: opt })
                            }
                            className={`py-2.5 px-3 rounded-2xl text-xs font-bold border text-center transition-all cursor-pointer capitalize ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-500 shadow-xs scale-[1.02]"
                                : "bg-slate-50/80 text-slate-900 border-slate-200 hover:bg-indigo-50/60"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {formData.pronouns === "other" && (
                      <input
                        type="text"
                        placeholder="Specify custom pronouns (e.g., ze/zir)"
                        value={formData.customPronouns}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customPronouns: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 mt-2"
                      />
                    )}
                  </div>

                  {/* Short Bio Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Short Bio (Author Introduction)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Write a brief intro about your experience, interests, or writing focus..."
                      className="w-full p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs text-slate-950 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 shadow-2xs transition resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* TAB 2: Avatar & Cropping */}
              {activeTab === "avatar" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {/* Current Avatar Card */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80">
                    <img
                      src={
                        formData.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                      }
                      alt="Avatar Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-indigo-500/20 shrink-0"
                    />
                    <div className="space-y-2.5 text-center sm:text-left flex-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          Profile Picture
                        </h4>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Active Preview
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Upload a file from your device
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload &amp; Crop File</span>
                        </button>

                        {user?.googleAvatar && (
                          <button
                            type="button"
                            onClick={handleUseGoogleAvatar}
                            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Google Sync</span>
                          </button>
                        )}

                        {formData.avatar && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, avatar: "" })
                            }
                            className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Clear</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Interactive Crop Section */}
                  {imageToCrop ? (
                    <div className="p-5 rounded-3xl bg-slate-950 text-white space-y-4 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          <span>Image Crop &amp; Alignment</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setImageToCrop(null)}
                          className="text-xs font-semibold text-slate-400 hover:text-white transition"
                        >
                          Cancel Crop
                        </button>
                      </div>

                      {/* Canvas Container */}
                      <div className="flex justify-center p-4 bg-slate-900/90 rounded-2xl overflow-hidden">
                        <canvas
                          ref={canvasRef}
                          className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-indigo-600 shadow-2xl"
                        />
                      </div>

                      {/* Zoom & Rotation Controls */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3">
                          <ZoomIn className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="text-xs font-semibold w-12 shrink-0">
                            Zoom:
                          </span>
                          <input
                            type="range"
                            min="0.8"
                            max="2.5"
                            step="0.05"
                            value={cropScale}
                            onChange={(e) =>
                              setCropScale(parseFloat(e.target.value))
                            }
                            className="w-full accent-indigo-600 cursor-pointer"
                          />
                          <span className="text-xs font-mono text-slate-400 shrink-0">
                            {Math.round(cropScale * 100)}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setCropRotation((prev) => (prev + 90) % 360)
                            }
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                            <span>Rotate 90°</span>
                          </button>

                          <button
                            type="button"
                            onClick={applyCrop}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                          >
                            <Check className="h-4 w-4" />
                            <span>Apply Cropped Picture</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Or Paste Direct Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={formData.avatar}
                        onChange={(e) =>
                          setFormData({ ...formData, avatar: e.target.value })
                        }
                        className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs text-slate-950 focus:outline-none focus:border-indigo-600 transition"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: Social Links */}
              {activeTab === "socials" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <p className="text-xs text-slate-600 font-semibold">
                    Connect your public profiles to display on author cards
                    across blog posts.
                  </p>

                  <div className="space-y-3.5">
                    {/* Twitter / X */}
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">
                        Twitter / X Handle
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-indigo-600">
                          𝕏
                        </div>
                        <input
                          type="url"
                          placeholder="https://x.com/username"
                          value={formData.socialLinks.twitter}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              socialLinks: {
                                ...formData.socialLinks,
                                twitter: e.target.value,
                              },
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-950 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition font-medium"
                        />
                      </div>
                    </div>

                    {/* GitHub */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        GitHub Profile
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900">
                          <svg
                            className="h-4 w-4 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        </div>
                        <input
                          type="url"
                          placeholder="https://github.com/username"
                          value={formData.socialLinks.github}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              socialLinks: {
                                ...formData.socialLinks,
                                github: e.target.value,
                              },
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-950 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition font-medium"
                        />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        LinkedIn Profile
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-600">
                          <svg
                            className="h-4 w-4 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
                          </svg>
                        </div>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={formData.socialLinks.linkedin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              socialLinks: {
                                ...formData.socialLinks,
                                linkedin: e.target.value,
                              },
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-950 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition font-medium"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Personal Website / Portfolio
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
                          <Globe className="h-4 w-4" />
                        </div>
                        <input
                          type="url"
                          placeholder="https://yourdomain.com"
                          value={formData.socialLinks.website}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              socialLinks: {
                                ...formData.socialLinks,
                                website: e.target.value,
                              },
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-950 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Modal Bottom Action Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto sticky bottom-0 bg-white z-10 py-2">
                <p className="text-[11px] text-slate-500 font-semibold hidden sm:block">
                  Changes save to database immediately
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer border border-indigo-500 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
