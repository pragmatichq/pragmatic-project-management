import React, { useCallback, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Document from "@tiptap/extension-document";
import { EditorMenuBar } from "./EditorMenuBar";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { debounce } from "@/lib/utils";
import { useStableQuery } from "@/lib/hooks/useStableQuery";

const TitleDocument = Document.extend({ content: "heading" });

const titleExtensions = [
  TitleDocument,
  StarterKit.configure({ document: false, hardBreak: false }),
  Placeholder.configure({
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-mauve-11 before:opacity-50 before-pointer-events-none",
    placeholder: () => "Add a title...",
  }),
];

const contentExtensions = [
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  TaskList,
  TaskItem.configure({ nested: false }),
  Placeholder.configure({
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-mauve-11 before:opacity-50 before-pointer-events-none",
    placeholder: () => "Add a description or choose a template above...",
  }),
];

const titleEditorProps = {
  attributes: { class: "prose max-w-full focus-visible:outline-none" },
};
const contentEditorProps = {
  attributes: {
    class: "prose max-w-full focus-visible:outline-none min-h-[300px] p-2",
  },
};

function safeJSONParse(item: string) {
  try {
    return JSON.parse(item);
  } catch (error) {
    return null;
  }
}

export function BroadcastEditor({
  broadcastId,
}: {
  broadcastId: Id<"broadcasts"> | undefined;
}) {
  if (!broadcastId) {
    return <div>Choose a broadcast to edit, or create a new one</div>;
  }

  const updateBroadcast = useMutation(api.broadcasts.update);
  const broadcast = broadcastId
    ? useStableQuery(api.broadcasts.get, { broadcastId })
    : null;

  const updateContent = async (): Promise<void> => {
    if (!broadcast) return; // Ensure broadcast is defined
    let newTitle = titleEditor?.getJSON()?.content?.[0]?.content?.[0]?.text;
    const response = await updateBroadcast({
      broadcastId: broadcast._id, // Access _id directly since broadcast is checked to be non-null
      content: contentEditor?.getHTML(),
      title: newTitle,
    });
    toast.success("Broadcast draft saved");
  };

  const saveBroadcastLocally = async (editor: any, type: string) => {
    if (!broadcast) return; // Ensure broadcast is defined
    const key = `broadcast-${type}-${broadcast._id}`;
    const value = JSON.stringify(editor.getJSON());
    localStorage.setItem(key, value);
  };

  const titleEditor = useEditor({
    extensions: titleExtensions,
    content: localStorage.getItem("broadcast-title-" + broadcast?._id)
      ? safeJSONParse(
          localStorage.getItem("broadcast-title-" + broadcast?._id) as string
        )
      : broadcast?.title,
    editorProps: titleEditorProps,
    onUpdate: ({ editor }) => {
      if (broadcast?.status !== "published") {
        debouncedUpdateContent(editor);
      } else {
        saveBroadcastLocally(editor, "title");
      }
    },
  });

  const contentEditor = useEditor({
    extensions: contentExtensions,
    content: localStorage.getItem("broadcast-content-" + broadcast?._id)
      ? safeJSONParse(
          localStorage.getItem("broadcast-content-" + broadcast?._id) as string
        )
      : broadcast?.content,
    editorProps: contentEditorProps,
    onUpdate: ({ editor }) => {
      if (broadcast?.status !== "published") {
        debouncedUpdateContent(editor);
      } else {
        saveBroadcastLocally(editor, "content");
      }
    },
  });

  const debouncedUpdateContent = useCallback(debounce(updateContent, 800), [
    titleEditor,
    contentEditor,
    broadcast,
  ]);

  useEffect(() => {
    if (titleEditor && broadcast?.title) {
      titleEditor.commands.setContent(
        localStorage.getItem("broadcast-title-" + broadcast?._id)
          ? safeJSONParse(
              localStorage.getItem(
                "broadcast-title-" + broadcast?._id
              ) as string
            )
          : broadcast?.title
      );
    }
  }, [broadcast, titleEditor]);

  useEffect(() => {
    if (contentEditor && broadcast?.content) {
      contentEditor.commands.setContent(
        localStorage.getItem("broadcast-content-" + broadcast?._id)
          ? safeJSONParse(
              localStorage.getItem(
                "broadcast-content-" + broadcast?._id
              ) as string
            )
          : broadcast?.content
      );
    }
  }, [broadcast, contentEditor]);

  return (
    <>
      {broadcast && (
        <>
          <EditorContent editor={titleEditor} />
          <div className="bg-muted p-2 rounded-sm border-solid border">
            <EditorContent editor={contentEditor} />
            <Button
              onClick={() => {
                localStorage.removeItem("broadcast-content-" + broadcast._id);
                localStorage.removeItem("broadcast-title-" + broadcast._id);
                contentEditor?.commands.setContent(broadcast.content ?? "");
                titleEditor?.commands.setContent(broadcast.title ?? "");
              }}
            >
              Revert Draft
            </Button>
            <Button
              onClick={() => {
                updateContent();
                localStorage.removeItem("broadcast-content-" + broadcast._id);
                localStorage.removeItem("broadcast-title-" + broadcast._id);
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                updateBroadcast({
                  broadcastId: broadcast._id,
                  status: "published",
                });
                console.log(broadcast);
              }}
            >
              Publish
            </Button>
            <Button
              onClick={() => {
                updateBroadcast({
                  broadcastId: broadcast._id,
                  status: "draft",
                });
                console.log(broadcast);
              }}
            >
              Draft
            </Button>
            Current state: {broadcast.status}
          </div>
        </>
      )}
    </>
  );
}
