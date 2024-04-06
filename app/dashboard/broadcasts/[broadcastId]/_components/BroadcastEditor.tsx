import React, { useCallback, useEffect, useState } from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "../../../../../components/ui/button";
import { cn, debounce, safeJSONParse } from "@/lib/utils";
import {
  titleExtensions,
  titleEditorProps,
  textareaEditorProps,
  textareaExtensions,
} from "@/lib/editor-settings";
import { EditorMenuBar } from "@/components/shared/EditorMenuBar";

export function BroadcastEditor({
  broadcast,
}: {
  broadcast: Doc<"broadcasts"> | undefined;
}) {
  const [edited, setEdited] = useState(false);
  const updateBroadcast = useMutation(api.broadcasts.update);

  const updateContent = async (): Promise<void> => {
    if (!broadcast) return;
    let newTitle = titleEditor?.getJSON()?.content?.[0]?.content?.[0]?.text;
    const response = await updateBroadcast({
      broadcastId: broadcast._id,
      content: contentEditor?.getHTML(),
      title: newTitle,
    });
    if (broadcast.status === "draft") {
      toast.success("Broadcast draft saved");
    } else {
      toast.success("Broadcast edits published");
    }
  };

  const titleEditor = useEditor({
    extensions: titleExtensions,
    content: broadcast?.title,
    editorProps: titleEditorProps,
    onUpdate: ({ editor }) => {
      if (!edited) {
        debouncedUpdateContent(editor);
      }
    },
    editable: false,
  });

  const contentEditor = useEditor({
    extensions: textareaExtensions,
    content: broadcast?.content,
    editorProps: textareaEditorProps,
    onUpdate: ({ editor }) => {
      if (!edited) {
        debouncedUpdateContent(editor);
      }
    },
    editable: false,
  });

  const debouncedUpdateContent = useCallback(debounce(updateContent, 800), [
    titleEditor,
    contentEditor,
    broadcast,
  ]);

  useEffect(() => {
    if (broadcast?.status === "published" && !edited) {
      contentEditor?.setOptions({ editable: false });
      titleEditor?.setOptions({ editable: false });
      return;
    }
    contentEditor?.setOptions({ editable: true });
    titleEditor?.setOptions({ editable: true });
  }, [broadcast, edited, titleEditor, contentEditor]);

  console.log(titleEditor?.options.editable);

  return (
    <>
      {broadcast && contentEditor && titleEditor && (
        <>
          <ActionButtons
            edited={edited}
            broadcast={broadcast}
            contentEditor={contentEditor}
            titleEditor={titleEditor}
            setEdited={setEdited}
            updateContent={updateContent}
            updateBroadcast={updateBroadcast}
          />
          <EditorContent editor={titleEditor} />
          <div
            className={cn(
              broadcast?.status === "published" && !edited
                ? "-mt-2 -ml-2"
                : "bg-muted p-2 rounded-sm border-solid border"
            )}
          >
            <div className="flex justify-between">
              {broadcast?.status === "published" && !edited ? null : (
                <EditorMenuBar editor={contentEditor!} />
              )}
            </div>
            <EditorContent editor={contentEditor} />
          </div>
        </>
      )}
    </>
  );
}

interface ActionButtonsProps {
  edited: boolean;
  broadcast: Doc<"broadcasts">;
  contentEditor: Editor;
  titleEditor: Editor;
  setEdited: (edited: boolean) => void;
  updateContent: () => Promise<void>;
  updateBroadcast: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  edited,
  broadcast,
  contentEditor,
  titleEditor,
  setEdited,
  updateContent,
  updateBroadcast,
}) => {
  // Logic for rendering action buttons
  return (
    <div className="flex gap-1 justify-end">
      {edited && (
        <>
          <Button
            onClick={() => {
              contentEditor?.commands.setContent(broadcast.content ?? "");
              titleEditor?.commands.setContent(broadcast.title ?? "");
              setEdited(false);
              toast.info("Reverted changes");
            }}
            variant={"destructive"}
            className="h-10 px-3 text-xs"
          >
            Revert Draft
          </Button>
          <Button
            onClick={() => {
              updateContent();
              setEdited(false);
            }}
            className="h-10 px-3 text-xs"
          >
            Publish Changes
          </Button>
        </>
      )}
      {!edited && broadcast.status === "published" && (
        <Button onClick={() => setEdited(true)}>Edit</Button>
      )}
      {broadcast?.status === "draft" ? (
        <Button
          onClick={() => {
            updateBroadcast({
              broadcastId: broadcast._id,
              status: "published",
            });
            toast.success("Broadcast published");
          }}
          className="h-10 px-3 text-xs"
        >
          Publish
        </Button>
      ) : (
        <Button
          onClick={() => {
            updateBroadcast({
              broadcastId: broadcast._id,
              status: "draft",
            });
            toast.success("Broadcast set to draft");
            setEdited(false);
          }}
          variant={"outline"}
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-10 px-3 text-xs"
        >
          Unpublish
        </Button>
      )}
    </div>
  );
};
