"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Terminal,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

const lowlight = createLowlight(common);

export default function TiptapEditor({ content = "", onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "rounded-xl bg-gray-950 text-gray-100 p-4 font-mono text-sm my-4 overflow-x-auto border border-gray-800 shadow-inner",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full my-4 border border-gray-200 shadow-sm",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline underline-offset-4 font-medium",
        },
      }),
      Placeholder.configure({
        placeholder:
          "Write your architectural notes, code snippets, or API specs here...",
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[450px] px-2 py-1 text-black font-sans leading-relaxed [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/v1/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Image upload failed");

        const data = await res.json();
        if (data?.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Failed to upload image. Please try again.");
      } finally {
        e.target.value = "";
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Floating Developer Toolbar */}
      <div className="sticky top-16 z-20 flex flex-wrap items-center gap-1 rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-sm backdrop-blur-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("bold")
              ? "bg-gray-100 text-blue-600 font-semibold"
              : "text-gray-700"
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("italic")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-700"
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("strike")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-700"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("code")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-700"
          }`}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("codeBlock")
              ? "bg-gray-100 text-blue-600 font-bold"
              : "text-gray-700"
          }`}
          title="Code Block"
        >
          <Terminal className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-100 text-blue-600"
              : "text-gray-700"
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
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-100 text-blue-600"
              : "text-gray-700"
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
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-100 text-blue-600"
              : "text-gray-700"
          }`}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("bulletList")
              ? "bg-gray-100 text-blue-600 font-bold"
              : "text-gray-700"
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("orderedList")
              ? "bg-gray-100 text-blue-600 font-bold"
              : "text-gray-700"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded-lg p-2 hover:bg-gray-100 ${
            editor.isActive("blockquote")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-700"
          }`}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <label
          className="cursor-pointer rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          title="Upload Diagram / Image"
        >
          <ImageIcon className="h-4 w-4" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Canvas Container */}
      <div className="min-h-112.5 w-full text-black">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
