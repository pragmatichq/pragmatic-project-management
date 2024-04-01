import { EditorProvider } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import Mention from "@tiptap/extension-mention";
import suggestion from "./suggestion";
import HardBreak from "@tiptap/extension-hard-break";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Id } from "@/convex/_generated/dataModel";
import { Extension } from "@tiptap/react";
import { CommentSubmit } from "./comment-submit";

export function CommentEditor({ parent }: { parent: Id<"actions"> }) {
  const createComment = useMutation(api.comments.create);

  const saveMessage = async (message: string) => {
    if (message?.length) {
      await createComment({
        content: message,
        parent: parent,
      });
    }
  };

  const SaveOnEnter = Extension.create({
    name: "saveOnEnter",
    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          const state: any = editor.view.state;

          if (state.mention$.active) {
            return false;
          }
          if (!editor.isEmpty) {
            saveMessage(editor.getHTML());
          }

          editor.commands.clearContent();

          return true;
        },
      };
    },
  });

  const extensions = [
    Document,
    Mention.configure({
      HTMLAttributes: {
        class: "mention",
      },
      suggestion,
    }),
    SaveOnEnter,
    Paragraph,
    HardBreak,
    Text,
    Bold,
    History,
    Italic,
  ];

  const editorProps = {
    attributes: {
      class:
        "prose max-w-full focus-visible:outline-none w-full flex-grow bg-muted",
    },
  };

  return (
    <div className="flex items-center justify-between p-2 border rounded-md [&>div]:flex-grow bg-muted">
      <EditorProvider
        editorProps={editorProps}
        extensions={extensions}
        slotAfter={<CommentSubmit parent={parent} />}
      >
        {""}
      </EditorProvider>
    </div>
  );
}
