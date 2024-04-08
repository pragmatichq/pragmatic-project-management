import React, { useCallback, useEffect, useState } from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "../../../../components/ui/button";
import { cn, debounce, parseDate, safeJSONParse } from "@/lib/utils";
import {
  titleExtensions,
  titleEditorProps,
  textareaEditorProps,
  textareaExtensions,
} from "@/lib/editor-settings";
import { EditorMenuBar } from "@/components/shared/EditorMenuBar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

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
        <div className="flex flex-col space-y-4">
          <EditorContent editor={titleEditor} />
          <div
            className="flex gap-4
          "
          >
            <div className="bg-muted p-2 rounded-sm border-solid border w-full">
              <div className="flex justify-between">
                {broadcast?.status === "published" && !edited ? null : (
                  <EditorMenuBar editor={contentEditor!} />
                )}
              </div>
              <EditorContent editor={contentEditor} />
            </div>
            <ActionButtons
              edited={edited}
              broadcast={broadcast}
              contentEditor={contentEditor}
              titleEditor={titleEditor}
              setEdited={setEdited}
              updateContent={updateContent}
              updateBroadcast={updateBroadcast}
            />
          </div>
        </div>
      )}
    </>
  );
}

interface ActionButtonsProps {
  edited: boolean;
  broadcast: Doc<"broadcasts">;
  contentEditor: Editor;
  titleEditor: Editor;
  updateBroadcast: any;
  setEdited: (edited: boolean) => void;
  updateContent: () => Promise<void>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  edited,
  broadcast,
  contentEditor,
  titleEditor,
  updateBroadcast,
  setEdited,
  updateContent,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const validDate = parseDate(broadcast.publish_date);

  const setDate = async (newDate: Date | undefined) => {
    const newPublishDate = newDate ? newDate.toISOString() : "";
    if (newPublishDate !== broadcast.publish_date) {
      await updateBroadcast({
        broadcastId: broadcast._id,
        publish_date: newPublishDate,
      });
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex-1 space-y-2">
      <div className="flex flex-col justify-end w-[200px] border p-2 bg-muted text-muted-foreground rounded-sm space-y-1">
        <Label className="text-xs">Publish Date</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !validDate && "text-muted-foreground"
              )}
              disabled={
                broadcast.status === "published" && !edited ? true : false
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {validDate ? format(validDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={validDate}
              defaultMonth={validDate || undefined}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col justify-end w-[200px] border p-2 bg-muted text-muted-foreground rounded-sm space-y-1">
        <Label className="text-xs">Actions</Label>
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
            {validDate! > today || !validDate ? "Schedule" : "Publish"}
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
        {!edited && broadcast.status === "published" && (
          <Button onClick={() => setEdited(true)}>Edit</Button>
        )}
        {edited && (
          <>
            <Button
              onClick={() => {
                updateContent();
                setEdited(false);
              }}
              className="h-10 px-3 text-xs"
            >
              Publish Changes
            </Button>
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
          </>
        )}
      </div>
    </div>
  );
};
