import { EditorContent, useEditor } from "@tiptap/react";
import React, { useCallback } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { ActionWithMembers } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { titleEditorProps, titleExtensions } from "@/lib/editor-settings";

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
    extensions: titleExtensions,
    editorProps: titleEditorProps,
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
