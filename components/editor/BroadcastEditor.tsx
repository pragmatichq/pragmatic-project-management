import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Document from "@tiptap/extension-document";

import { EditorMenuBar } from "./EditorMenuBar";

import React from "react";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { toast } from "sonner";
import { debounce } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

const TitleDocument = Document.extend({
  content: "heading",
});

const titleExtensions = [
  TitleDocument,
  StarterKit.configure({
    document: false,
    hardBreak: false,
  }),
  Placeholder.configure({
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-mauve-11 before:opacity-50 before-pointer-events-none",
    placeholder: () => {
      return "Add a title...";
    },
  }),
];

const titleEditorProps = {
  attributes: {
    class: "prose max-w-full focus-visible:outline-none",
  },
};

const contentExtensions = [
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

const contentEditorProps = {
  attributes: {
    class: "prose max-w-full focus-visible:outline-none min-h-[300px] p-2",
  },
};

export function BroadcastEditor({
  broadcast,
}: {
  broadcast: Doc<"broadcasts">;
}) {
  const updateBroadcast = useMutation(api.broadcasts.update);

  const updateContent = async (editor: any): Promise<void> => {
    const response = await updateBroadcast({
      broadcastId: broadcast._id,
    });
    toast.success("Action description updated");
  };

  return (
    <div className="bg-muted p-2 rounded-sm border-solid border">
      <EditorProvider
        editorProps={titleEditorProps}
        content={broadcast.title}
        extensions={titleExtensions}
        onCreate={({ editor }) => {
          editor.view.dom.setAttribute("spellcheck", "false");
          editor.view.dom.setAttribute("autocomplete", "off");
          editor.view.dom.setAttribute("autocapitalize", "off");
        }}
        onUpdate={({ editor }) => {
          console.log(editor.getJSON());
        }}
      >
        {""}
      </EditorProvider>
      <EditorProvider
        editorProps={contentEditorProps}
        slotBefore={<EditorMenuBar />}
        content={broadcast.content}
        extensions={contentExtensions}
        onUpdate={({ editor }) => {
          console.log(editor.getJSON());
        }}
      >
        {""}
      </EditorProvider>
    </div>
  );
}
