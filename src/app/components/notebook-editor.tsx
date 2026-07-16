import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  Bold, Italic, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, ListChecks, Eraser, BookText, Save, CircleCheck,
} from "lucide-react";

const HIGHLIGHT_COLORS = [
  { color: "#FEF08A", name: "Yellow" },
  { color: "#BBF7D0", name: "Green" },
  { color: "#BAE6FD", name: "Blue" },
  { color: "#FBCFE8", name: "Pink" },
  { color: "#FED7AA", name: "Orange" },
];

const TEXT_COLORS = [
  { color: null, name: "Default", bg: "bg-foreground" },
  { color: "#2563EB", name: "Blue",   bg: "bg-blue-600" },
  { color: "#DC2626", name: "Red",    bg: "bg-red-600" },
  { color: "#16A34A", name: "Green",  bg: "bg-green-600" },
  { color: "#9333EA", name: "Purple", bg: "bg-purple-600" },
  { color: "#EA580C", name: "Orange", bg: "bg-orange-600" },
];

export function NotebookToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const Btn = ({ onClick, active, title, children }: {
    onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
  }) => (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-all shrink-0 ${
        active ? "bg-primary text-white shadow-sm" : "text-foreground/60 hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );

  const Sep = () => <div className="w-px h-5 bg-border mx-1 shrink-0" />;

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-gray-50/80 flex-wrap shrink-0">
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">H1</Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">H2</Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">H3</Btn>
      <Btn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Normal">¶</Btn>
      <Sep />
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={12} /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={12} /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
        <span style={{ textDecoration: "underline", fontSize: 11 }}>U</span>
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough size={12} /></Btn>
      <Sep />
      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mr-1 shrink-0">Mark</span>
      {HIGHLIGHT_COLORS.map(({ color, name }) => (
        <button
          key={color}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHighlight({ color }).run(); }}
          title={`Highlight ${name}`}
          className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-125 shrink-0 ${
            editor.isActive("highlight", { color }) ? "border-gray-700 scale-125 shadow-sm" : "border-white shadow"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
      <button
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); }}
        title="Clear highlight"
        className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted transition-colors shrink-0"
      >
        <Eraser size={10} className="text-muted-foreground" />
      </button>
      <Sep />
      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mr-1 shrink-0">Color</span>
      {TEXT_COLORS.map(({ color, name, bg }) => (
        <button
          key={name}
          onMouseDown={e => {
            e.preventDefault();
            if (!color) editor.chain().focus().unsetColor().run();
            else editor.chain().focus().setColor(color).run();
          }}
          title={name}
          className={`w-5 h-5 rounded-full border border-white shadow hover:scale-125 transition-all shrink-0 ${bg}`}
          style={color ? { backgroundColor: color } : { background: "linear-gradient(135deg,#1a1c2e 50%,#fff 50%)", border: "1px solid #ccc" }}
        />
      ))}
      <Sep />
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List size={12} /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list"><ListOrdered size={12} /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Checklist"><ListChecks size={12} /></Btn>
      <Sep />
      <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left"><AlignLeft size={12} /></Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center"><AlignCenter size={12} /></Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right"><AlignRight size={12} /></Btn>
    </div>
  );
}

export function NotebookEditorPanel({
  chapterKey,
  subject,
  chapterName,
  initialContent,
  onContentChange,
}: {
  chapterKey: string;
  subject?: string;
  chapterName?: string;
  initialContent: string;
  onContentChange: (key: string, html: string) => void;
}) {
  const [saved, setSaved] = useState(false);
  const prevKey = useRef("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: false }),
    ],
    content: initialContent || "<p></p>",
    onUpdate: ({ editor }) => {
      onContentChange(chapterKey, editor.getHTML());
    },
    editorProps: {
      attributes: { class: "tiptap", spellcheck: "true" },
    },
  });

  useEffect(() => {
    if (editor && chapterKey !== prevKey.current) {
      prevKey.current = chapterKey;
      editor.commands.setContent(initialContent || "<p></p>");
    }
  }, [editor, chapterKey, initialContent]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0 bg-white">
        <div className="flex items-center gap-2 min-w-0">
          <BookText size={14} className="text-primary shrink-0" />
          <span className="text-xs font-bold text-foreground truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {subject || "Notebook"}{chapterName ? ` — ${chapterName}` : ""}
          </span>
        </div>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            saved ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {saved ? <CircleCheck size={12} /> : <Save size={12} />}
          {saved ? "Saved!" : "Save"}
        </button>
      </div>
      <NotebookToolbar editor={editor} />
      <div
        className="flex-1 overflow-y-auto hide-scrollbar relative cursor-text"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(67,97,238,0.07) 27px, rgba(67,97,238,0.07) 28px)",
          backgroundPositionY: "20px",
        }}
        onClick={() => editor?.commands.focus()}
      >
        {editor?.isEmpty && (
          <div className="absolute top-5 left-5 text-muted-foreground/40 text-sm pointer-events-none select-none leading-7">
            Start writing your notes here…
          </div>
        )}
        <div className="p-5 min-h-full">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
