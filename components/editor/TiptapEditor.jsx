"use client";

import { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImageIcon,
  Plus,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const lowlight = createLowlight(common);

export default function TiptapEditor({ content, onChange }) {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const imageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-indigo-600 underline font-medium hover:text-indigo-700 transition cursor-pointer",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class:
            "rounded-3xl border border-slate-200/80 shadow-lg my-6 max-w-full mx-auto block",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "bg-slate-900 text-indigo-300 font-mono p-5 rounded-2xl border border-slate-800 text-sm my-6 leading-relaxed overflow-x-auto shadow-xl",
        },
      }),
    ],
    content:
      content ||
      "<h2>Architecture Overview &amp; Technical Problem</h2><p>Tell your deep technical story here... Start by explaining the problem statement, why traditional approaches failed, and the architectural trade-offs you considered.</p><h3>Implementation &amp; Code Analysis</h3><p>Detail your solution step-by-step with syntax-highlighted code blocks, benchmarks, and production lessons learned.</p>",
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  // Handle image upload directly from local PC file gallery
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image file size should be under 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          editor.chain().focus().setImage({ src: event.target.result }).run();
          setShowPlusMenu(false);
          toast.success("Image inserted into story!");
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const triggerGalleryPicker = () => {
    imageInputRef.current?.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter link URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const toggleCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
    setShowPlusMenu(false);
  };

  return (
    <div className="space-y-6 font-sans relative">
      {/* Hidden File Input for Image Gallery */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Sleek Floating Glassmorphic Formatting Bar (Medium Style) */}
      <div className="sticky top-14 sm:top-16 z-30 py-2 px-3 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-md flex items-center justify-between gap-1 overflow-x-auto scrollbar-none select-none">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 text-xs font-bold ${
              editor.isActive("heading", { level: 1 })
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 text-xs font-bold ${
              editor.isActive("heading", { level: 2 })
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 text-xs font-bold ${
              editor.isActive("heading", { level: 3 })
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
              editor.isActive("bold")
                ? "bg-indigo-600 text-white shadow-2xs font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
              editor.isActive("italic")
                ? "bg-indigo-600 text-white shadow-2xs font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
              editor.isActive("strike")
                ? "bg-indigo-600 text-white shadow-2xs font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
              editor.isActive("bulletList")
                ? "bg-indigo-600 text-white shadow-2xs font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
              editor.isActive("orderedList")
                ? "bg-indigo-600 text-white shadow-2xs font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
              editor.isActive("blockquote")
                ? "bg-indigo-600 text-white shadow-2xs font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
              editor.isActive("link")
                ? "bg-indigo-600 text-white shadow-2xs font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={triggerGalleryPicker}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition cursor-pointer shrink-0"
            title="Insert Image from PC Gallery"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Code Block Trigger Button */}
        <button
          type="button"
          onClick={toggleCodeBlock}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0 ml-auto ${
            editor.isActive("codeBlock")
              ? "bg-indigo-600 text-white"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
          }`}
        >
          <Code className="h-3.5 w-3.5" />
          <span>
            {editor.isActive("codeBlock")
              ? "Code Block Active"
              : "+ Code Block"}
          </span>
        </button>
      </div>

      {/* Medium-Grade Unrestricted Writing Canvas (min-h-[850px]) */}
      <div className="w-full relative py-2">
        {/* Inline Medium Style Plus Menu Trigger */}
        <div className="absolute -left-10 top-3 hidden md:flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className="w-8 h-8 rounded-full border border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-600 transition flex items-center justify-center cursor-pointer bg-white shadow-2xs"
            title="Add Media / Code Block"
          >
            <Plus
              className={`h-4 w-4 transition-transform ${
                showPlusMenu ? "rotate-45" : ""
              }`}
            />
          </button>

          {showPlusMenu && (
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-lg animate-in fade-in slide-in-from-left-2">
              <button
                type="button"
                onClick={triggerGalleryPicker}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-bold text-slate-700 transition flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Gallery Image</span>
              </button>
              <button
                type="button"
                onClick={toggleCodeBlock}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-bold text-slate-700 transition flex items-center gap-1 cursor-pointer"
              >
                <Code className="h-3.5 w-3.5" />
                <span>Code</span>
              </button>
            </div>
          )}
        </div>

        {/* Pure Medium Prose Canvas */}
        <div className="prose prose-slate prose-lg sm:prose-xl max-w-none focus:outline-none min-h-212.5 text-slate-900 leading-relaxed font-sans select-text">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Clean Writing Guide Footer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>
            Pro tip: Click the image icon to select pictures directly from your
            PC device gallery.
          </span>
        </span>
        <span className="hidden sm:inline font-bold text-slate-800 font-mono">
          Medium Story Canvas
        </span>
      </div>
    </div>
  );
}
