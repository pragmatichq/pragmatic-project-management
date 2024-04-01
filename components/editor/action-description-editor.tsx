import { EditorProvider, Mark } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Mention from "@tiptap/extension-mention";
import TextStyle from "@tiptap/extension-text-style";

import { MenuBar } from "./editor-menubar";

import React from "react";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Id } from "@/convex/_generated/dataModel";

import suggestion from "./suggestion";
import { toast } from "sonner";

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Mention.configure({
    HTMLAttributes: {
      class: "mention",
    },
    suggestion,
  }),
  TaskList,
  TaskItem.configure({
    nested: false,
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
    class: "prose max-w-full focus-visible:outline-none min-h-[300px] p-2",
  },
};

export function ActionDescriptionEditor({
  actionId,
  content,
}: {
  actionId: Id<"actions">;
  content: any;
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

  const updateAction = useMutation(api.actions.update);

  const updateContent = async (editor: any): Promise<void> => {
    const response = await updateAction({
      actionId: actionId,
      description: editor.getJSON(),
    });
    toast.success("Action description updated");
  };

  const debouncedUpdateContent = debounce(updateContent, 800);

  return (
    <div className="bg-muted p-2 rounded-sm border-solid border">
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
    </div>
  );
}
