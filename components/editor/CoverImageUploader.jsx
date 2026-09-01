"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Sliders,
  Sparkles,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";

const PRESET_COVERS = [
  {
    name: "Nebula Gradient",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Cyber Neon",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Minimal Flow",
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Matrix Code",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function CoverImageUploader({ coverImage, onSetCoverImage }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [bannerHeight, setBannerHeight] = useState("h-48 sm:h-64 md:h-72");
  const [objectFit, setObjectFit] = useState("object-cover");
  const [brightness, setBrightness] = useState(100);

  // File Upload Processor
  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSetCoverImage(event.target.result);
        toast.success("Cover banner updated!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-3 font-sans select-none">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {coverImage ? (
        /* Active Cover State */
        <div className="space-y-3">
          <div className="relative rounded-3xl overflow-hidden group border border-slate-200/90 shadow-2xs bg-slate-950">
            <img
              src={coverImage}
              alt="Cover Banner"
              style={{ filter: `brightness(${brightness}%)` }}
              className={`w-full ${bannerHeight} ${objectFit} transition-all duration-300`}
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-slate-950/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-slate-950/60 to-transparent pointer-events-none" />

            {/* Quick Floating Controls (Top Right) */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTools(!showTools)}
                className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md transition backdrop-blur-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="h-3.5 w-3.5 text-indigo-600" />
                <span>{showTools ? "Close Tools" : "Adjust Aspect"}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md transition backdrop-blur-md flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Change</span>
              </button>

              <button
                type="button"
                onClick={() => onSetCoverImage("")}
                className="p-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition backdrop-blur-md cursor-pointer"
                title="Remove Cover Image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Banner Adjustment Tools Drawer */}
          {showTools && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Banner Aspect &amp; Filter Tuning</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowTools(false)}
                  className="text-slate-400 hover:text-slate-950 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Banner Height */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Banner Height
                  </label>
                  <div className="flex rounded-xl bg-white border border-slate-200 p-0.5">
                    <button
                      type="button"
                      onClick={() => setBannerHeight("h-36 sm:h-48")}
                      className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition ${
                        bannerHeight.includes("h-36")
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      Compact
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerHeight("h-48 sm:h-64 md:h-72")}
                      className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition ${
                        bannerHeight.includes("h-48")
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerHeight("h-64 sm:h-80 md:h-96")}
                      className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition ${
                        bannerHeight.includes("h-64")
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      Tall
                    </button>
                  </div>
                </div>

                {/* Object Fit */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Fit Mode
                  </label>
                  <div className="flex rounded-xl bg-white border border-slate-200 p-0.5">
                    <button
                      type="button"
                      onClick={() => setObjectFit("object-cover")}
                      className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition ${
                        objectFit === "object-cover"
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      Fill Banner
                    </button>
                    <button
                      type="button"
                      onClick={() => setObjectFit("object-contain")}
                      className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition ${
                        objectFit === "object-contain"
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      Fit Image
                    </button>
                  </div>
                </div>

                {/* Brightness Filter */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 items-center justify-between">
                    <span>Brightness Filter</span>
                    <span className="font-mono text-indigo-600 font-bold">
                      {brightness}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Sleek Drag & Drop Empty Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all duration-200 text-center space-y-4 ${
            isDragging
              ? "border-indigo-600 bg-indigo-50/70 scale-[0.99]"
              : "border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-white"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center mx-auto border border-slate-200/90 shadow-2xs">
            <ImageIcon className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">
              Add High-Resolution Story Cover
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Drag &amp; drop an image here, upload from your PC, or select a
              tech preset below.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer border border-indigo-500"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload from PC</span>
            </button>
          </div>

          {/* Quick Presets Selector */}
          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 mr-1">
              Quick Presets:
            </span>
            {PRESET_COVERS.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => onSetCoverImage(preset.url)}
                className="w-9 h-6 rounded-lg overflow-hidden border border-slate-200 hover:border-indigo-500 transition cursor-pointer hover:scale-105"
                title={preset.name}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
