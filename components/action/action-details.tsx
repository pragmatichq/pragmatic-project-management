"use client";

import { DueDate } from "@/components/shared/DateSelector";
import { AssigneeList } from "@/components/shared/MemberSelector";
import { StatusSelector } from "@/components/shared/StatusSelector";
import { FlagSelector } from "@/components/shared/FlagSelector";
import { CommentList } from "@/components/shared/CommentList";
import { ActionDescriptionEditor } from "@/components/editor/action-description-editor";
import { ActionTitleEditor } from "@/components/editor/action-title-editor";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Label } from "@/components/ui/label";

import FileUpload from "./action-file-upload";

import { Doc } from "@/convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentEditor } from "../editor/comment-editor";
import Dropzone from "react-dropzone";

interface ActionsWithAssignees extends Doc<"actions"> {
  assignees: string[];
}

interface TaskModalProps {
  action: ActionsWithAssignees;
}

export function ActionDetails({ action }: TaskModalProps) {
  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="action-details">
      <ResizablePanel defaultSize={80} minSize={50}>
        <ScrollArea className="h-screen">
          <div className="grow grid gap-4 auto-rows-min p-4">
            <div className="sticky top-0 bg-white py-2 -my-2">
              <ActionTitleEditor
                actionTitle={action.title as string}
                actionId={action?._id}
              />
            </div>
            <div className="flex gap-6 flex-rows -mb-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Status</Label>
                <StatusSelector action={action} />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Assignees</Label>
                <AssigneeList action={action} purpose="assignees" />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs">Stakeholders</Label>
                <AssigneeList action={action} purpose="assignees" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Due Date</Label>
                <DueDate action={action} />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Flags</Label>
                <FlagSelector action={action} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold my-2">Details</h3>
              <ActionDescriptionEditor
                actionId={action._id}
                content={action.description as string}
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold my-2">Files</h3>
              <FileUpload actionId={action._id} />
            </div>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} minSize={16}>
        <div className="p-4 flex flex-col gap-4 h-screen">
          <div className="flex-none">
            <h3 className="text-2xl font-bold my-2">Discussions</h3>
          </div>
          <CommentList parent={action._id} />
          <div className="flex-none">
            <CommentEditor parent={action._id} />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
