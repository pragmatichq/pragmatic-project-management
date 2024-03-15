import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import React from "react";
import { Button } from "../ui/button";
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  PilcrowIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  UndoIcon,
  RedoIcon,
  MinusIcon,
  ListIcon,
  ListOrderedIcon,
} from "lucide-react";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Id } from "@/convex/_generated/dataModel";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 flex-wrap mb-4">
      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className="p-2 h-auto"
        variant={editor.isActive("paragraph") ? "default" : "ghost"}
      >
        <PilcrowIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <Heading1Icon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <Heading2Icon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <Heading3Icon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <BoldIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <ItalicIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <StrikethroughIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <ListIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <ListOrderedIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        variant="ghost"
        className="p-2 h-auto"
      >
        <MinusIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        variant="ghost"
        className="p-2 h-auto"
      >
        <UndoIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        variant="ghost"
        className="p-2 h-auto"
      >
        <RedoIcon size={16} />
      </Button>
      <Button
        onClick={() =>
          editor
            .chain()
            .insertContent(
              "<h1>Example Text</h1><p>Some text for the template.</p>"
            )
            .focus("end")
            .run()
        }
        variant="ghost"
        className="p-2 h-auto"
      >
        Template
      </Button>
    </div>
  );
};

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Placeholder.configure({
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-mauve-11 before:opacity-50 before-pointer-events-none",
    placeholder: () => {
      return "Add a description or choose a template above...";
    },
  }),
];

const editorProps = {
  attributes: {
    class: "prose max-w-full focus-visible:outline-none min-h-[200px]",
  },
};

export function TaskDescriptionEditor({
  taskId,
  content,
}: {
  taskId: Id<"tasks">;
  content: string;
}) {
  function debounce(
    func: (...args: any[]) => void,
    delay: number
  ): (...args: any[]) => void {
    let debounceTimer: ReturnType<typeof setTimeout>;
    return function (...args: any[]) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  }

  const updateTask = useMutation(api.tasks.update);

  const updateContent = (editor: any): void => {
    updateTask({ id: taskId, description: editor.getHTML() });
  };

  const debouncedUpdateContent = debounce(updateContent, 800);

  return (
    <EditorProvider
      editorProps={editorProps}
      slotBefore={<MenuBar />}
      content={content}
      extensions={extensions}
      onUpdate={({ editor }) => {
        debouncedUpdateContent(editor);
      }}
    >
      {""}
    </EditorProvider>
  );
}
