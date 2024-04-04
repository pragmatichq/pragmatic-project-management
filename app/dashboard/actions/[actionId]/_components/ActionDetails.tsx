"use client";

import { DueDate } from "@/components/shared/DateSelector";
import { MemberSelector } from "@/components/shared/MemberSelector";
import { StatusSelector } from "@/components/shared/StatusSelector";
import { FlagSelector } from "@/components/shared/FlagSelector";
import { CommentList } from "@/components/shared/CommentList";
import { ActionDescriptionEditor } from "@/app/dashboard/actions/[actionId]/_components/ActionDescriptionEditor";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Label } from "@/components/ui/label";

import FileUpload from "@/components/action/action-file-upload";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentEditor } from "@/components/editor/CommentEditor";
import { ActionWithMembers } from "@/lib/types";
import { ActionTitleEditor } from "./ActionTitleEditor";

export function ActionDetails(action: ActionWithMembers) {
  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="action-details">
      <ResizablePanel defaultSize={80} minSize={50}>
        <ScrollArea className="h-[calc(100vh-40px)]">
          <div className="grow grid gap-4 auto-rows-min p-6">
            <div className="sticky top-0 bg-white py-2 -my-2 z-50">
              <ActionTitleEditor action={action} />
            </div>
            <div className="flex gap-6 flex-rows -mb-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Status</Label>
                <StatusSelector action={action} />
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
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} minSize={16}>
        <div className="p-6 flex flex-col h-[calc(100vh-40px)]">
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
