"use client";

import { notFound } from "next/navigation";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { TaskDetails } from "@/components/task/task-details";

interface SingleTaskPageProps {
  params: { task_id: Id<"tasks"> };
}

interface TaskWithAssignees extends Doc<"tasks"> {
  assignees: string[];
}

export default function SingleTaskPage({ params }: SingleTaskPageProps) {
  let task: Doc<"tasks"> | undefined;

  try {
    task = useQuery(api.tasks.get, {
      taskId: params.task_id,
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes("ArgumentValidationError")) {
      notFound();
    } else {
      throw e;
    }
  }

  return (
    <>
      {!task ? (
        <LoadingSpinner />
      ) : (
        <>
          <TaskDetails task={task as TaskWithAssignees} />
        </>
      )}
    </>
  );
}
