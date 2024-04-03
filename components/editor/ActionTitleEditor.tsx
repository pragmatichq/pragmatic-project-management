import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useCallback } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import { ActionWithMembers } from "@/lib/types";
import { debounce } from "@/lib/utils";

const TitleDocument = Document.extend({
  content: "heading",
});

const extensions = [
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

const editorProps = {
  attributes: {
    class: "prose max-w-full focus-visible:outline-none",
  },
};

export function ActionTitleEditor({ action }: { action: ActionWithMembers }) {
  const updateAction = useMutation(api.actions.update);

  const updateContent = async (editor: any): Promise<void> => {
    let newTitle = editor.getJSON()?.content?.[0]?.content?.[0]?.text;
    if (newTitle && action) {
      const response = await updateAction({
        actionId: action._id,
        title: newTitle,
      });
      toast.success("Action title updated");
    }
  };

  const editor = useEditor({
    extensions,
    editorProps,
    content: action.title,
    onCreate: ({ editor }) => {
      editor.view.dom.setAttribute("spellcheck", "false");
      editor.view.dom.setAttribute("autocomplete", "off");
      editor.view.dom.setAttribute("autocapitalize", "off");
    },
    onUpdate: ({ editor }) => {
      debouncedUpdateContent(editor);
    },
  });

  const debouncedUpdateContent = useCallback(debounce(updateContent, 800), [
    editor,
  ]);

  return <EditorContent editor={editor} />;
}
