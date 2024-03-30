import { EditorProvider } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";

const CustomDocument = Document.extend({
  content: "heading",
});

const extensions = [
  CustomDocument,
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

const editorProps = {
  attributes: {
    class: "prose max-w-full focus-visible:outline-none",
  },
};

export function ActionTitleEditor({
  actionId,
  actionTitle,
}: {
  actionId: Id<"actions">;
  actionTitle: string;
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
    let newTitle = editor.getJSON()?.content?.[0]?.content?.[0]?.text;
    if (newTitle && actionId) {
      const response = await updateAction({
        actionId: actionId,
        title: newTitle,
      });
      toast.success("Action title updated");
    }
  };

  const debouncedUpdateContent = debounce(updateContent, 800);

  return (
    <EditorProvider
      editorProps={editorProps}
      content={actionTitle}
      extensions={extensions}
      onCreate={({ editor }) => {
        editor.view.dom.setAttribute("spellcheck", "false");
        editor.view.dom.setAttribute("autocomplete", "off");
        editor.view.dom.setAttribute("autocapitalize", "off");
      }}
      onUpdate={({ editor }) => {
        debouncedUpdateContent(editor);
      }}
    >
      {""}
    </EditorProvider>
  );
}
