"use client";

import { DueDate } from "@/components/shared/due-date";
import { AssigneeList } from "@/components/shared/assignee-list";
import { StatusSelector } from "@/components/shared/status-selector";
import { FlagSelector } from "@/components/shared/flag-selector";
import { CommentList } from "@/components/shared/comment-list";
import { ActionDescriptionEditor } from "@/components/editor/action-description-editor";
import { ActionTitleEditor } from "@/components/editor/action-title-editor";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

import FileUpload from "./action-file-upload";

import { Doc } from "@/convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            <ActionTitleEditor
              actionTitle={action.title as string}
              actionId={action?._id}
            />
            <div className="flex gap-6 flex-rows">
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Status</Label>
                <StatusSelector action={action} />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Flags</Label>
                <FlagSelector action={action} />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Assignees</Label>
                <AssigneeList action={action} purpose="assignees" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Due Date</Label>
                <DueDate action={action} />
              </div>
            </div>
            <div>
              <ActionDescriptionEditor
                actionId={action._id}
                content={action.description as string}
              />
            </div>
            <FileUpload actionId={action._id} />
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} minSize={16}>
        <div className="p-4">
          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <TabsContent value="comments">
              <CommentList parent={action._id} />
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
