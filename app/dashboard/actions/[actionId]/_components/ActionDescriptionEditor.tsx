import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { EditorMenuBar } from "../../../../../components/shared/EditorMenuBar";
import React, { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { debounce } from "@/lib/utils";
import { ActionWithMembers } from "@/lib/types";
import {
  textareaEditorProps,
  textareaWithMentionsExtensions,
} from "@/lib/editor-settings";

export function ActionDescriptionEditor({
  action,
}: {
  action: ActionWithMembers;
}) {
  const updateAction = useMutation(api.actions.update);

  const updateContent = async (editor: any): Promise<void> => {
    const response = await updateAction({
      actionId: action._id,
      description: editor.getJSON(),
    });
    toast.success("Action description updated");
  };

  const editor: Editor | null = useEditor({
    extensions: textareaWithMentionsExtensions,
    editorProps: textareaEditorProps,
    content: action.description,
    onUpdate: ({ editor }) => {
      debouncedUpdateContent(editor);
    },
  });

  const debouncedUpdateContent = useCallback(debounce(updateContent, 800), [
    editor,
  ]);

  return (
    <div className="bg-muted p-2 rounded-sm border-solid border">
      <EditorMenuBar editor={editor!} />
      <EditorContent editor={editor!} />
    </div>
  );
}
