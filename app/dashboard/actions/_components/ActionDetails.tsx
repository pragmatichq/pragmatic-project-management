"use client";

import { DueDate } from "@/components/shared/DateSelector";
import { MemberSelector } from "@/components/shared/MemberSelector";
import { StatusSelector } from "@/components/shared/StatusSelector";
import { FlagSelector } from "@/components/shared/FlagSelector";
import { CommentList } from "@/components/shared/CommentList";
import { ActionDescriptionEditor } from "@/app/dashboard/actions/_components/ActionDescriptionEditor";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Label } from "@/components/ui/label";

import FileUpload from "@/components/action/action-file-upload";

import { CommentEditor } from "@/components/editor/CommentEditor";
import { ActionWithMembers } from "@/lib/types";
import { ActionTitleEditor } from "./ActionTitleEditor";

export function ActionDetails(action: ActionWithMembers) {
  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="action-details">
      <ResizablePanel defaultSize={80} minSize={50}>
        <div className="grow grid gap-6 auto-rows-min p-6 h-[calc(100vh-45px)] overflow-auto">
          <div className="sticky -top-6 py-2 bg-white z-50">
            <ActionTitleEditor action={action} />
          </div>
          <div className="flex gap-6 flex-rows -mb-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Status</Label>
              <StatusSelector action={action} mode="status" />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">Time Frame</Label>
              <StatusSelector action={action} mode="time_frame" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Assignees</Label>
              <MemberSelector action={action} purpose="assignees" />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">Stakeholders</Label>
              <MemberSelector action={action} purpose="stakeholders" />
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
            <ActionDescriptionEditor action={action} />
          </div>
          <div>
            <h3 className="text-2xl font-bold my-2">Files</h3>
            <FileUpload actionId={action._id} />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} minSize={16}>
        <div className="flex flex-col p-6 h-[calc(100vh-45px)] overflow-auto">
          <div className="flex-none">
            <h3 className="text-2xl font-bold my-2">Discussions</h3>
          </div>
          <CommentList parent={action._id} />
          <div className="flex-none mt-4">
            <CommentEditor parent={action._id} />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
