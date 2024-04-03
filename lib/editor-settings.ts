import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import suggestion from "./suggestion";

const TitleDocument = Document.extend({
  content: "heading",
});

export const titleExtensions = [
  TitleDocument,
  StarterKit.configure({ document: false, hardBreak: false }),
  Placeholder.configure({
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-mauve-11 before:opacity-50 before-pointer-events-none",
    placeholder: () => "Add a title...",
  }),
];

export const textareaExtensions = [
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  TaskList,
  TaskItem.configure({ nested: false }),
  Placeholder.configure({
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-mauve-11 before:opacity-50 before-pointer-events-none",
    placeholder: () => "Start writing...",
  }),
];

export const textareaWithMentionsExtensions = [
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

export const titleEditorProps = {
  attributes: { class: "prose max-w-full focus-visible:outline-none" },
};

export const textareaEditorProps = {
  attributes: {
    class: "prose max-w-full focus-visible:outline-none min-h-[300px] p-2",
  },
};
