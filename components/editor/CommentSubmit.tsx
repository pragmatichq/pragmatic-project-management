import { useCurrentEditor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Id } from "@/convex/_generated/dataModel";

export const CommentSubmit = ({ parent }: { parent: Id<"actions"> }) => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const createComment = useMutation(api.comments.create);

  async function onSubmit() {
    if (editor?.isEmpty) return;
    await createComment({
      content: editor?.getHTML() as string,
      parent: parent,
    });
    editor?.commands.clearContent();
  }

  return (
    <Button className="ml-2" onClick={onSubmit} variant="default">
      Send
    </Button>
  );
};
