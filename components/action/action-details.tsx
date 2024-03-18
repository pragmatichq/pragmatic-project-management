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
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <ScrollArea className="h-screen">
          <div className="grow grid gap-4 auto-rows-min p-4">
            <ActionTitleEditor
              actionTitle={action.title as string}
              actionId={action?._id}
            />
            <ActionDescriptionEditor
              actionId={action._id}
              content={action.description as string}
            />
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="comments">
                <CommentList parent={action._id} />
              </TabsContent>
              <TabsContent value="files">
                <FileUpload actionId={action._id} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={15}>
        <div className="grid gap-6 auto-rows-min justify-items-start border-l p-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <StatusSelector
              actionId={action._id}
              currentStatus={action.status}
            />
          </div>
          <div className="grid gap-2">
            <Label>Flags</Label>
            <FlagSelector actionId={action._id} flags={action.flags as []} />
          </div>
          <div className="grid gap-2">
            <Label>Assignees</Label>
            <AssigneeList actionId={action._id} assignees={action.assignees} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="due-date">Due Date</Label>
            <DueDate actionId={action._id} dueDate={action.due_date} />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
