"use client";
import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";

import { useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { ProjectDetails } from "@/components/projects/project-details";
import { TaskModal } from "@/components/tasks/task-modal";

export default function SingleTaskPage({
  params,
}: {
  params: { project_id: string; task_id: string };
}) {
  let loading = true;
  const { orgId } = useAuth();

  const activeOrgId: string = orgId ?? "";

  const project = useQuery(api.projects.getProject, {
    organization: activeOrgId,
    _id: params.project_id,
  });

  const tasks = useQuery(api.tasks.getTasksByProject, {
    organization: activeOrgId,
    project: params.project_id,
  });

  const activeTask = useQuery(api.tasks.getTask, {
    organization: activeOrgId,
    _id: params.task_id,
  });

  if (activeTask === undefined) {
    loading = true;
  } else if (project === undefined) {
    loading = true;
  } else {
    loading = false;
  }
  if (!loading && !project) {
    notFound();
  } else if (!loading && !activeTask) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {project == undefined ? (
        <LoadingSpinner />
      ) : (
        <div>
          <TaskModal projectTitle={project.title} activeTask={activeTask} />
          <ProjectDetails project={project} tasks={tasks} />
        </div>
      )}
    </main>
  );
}
