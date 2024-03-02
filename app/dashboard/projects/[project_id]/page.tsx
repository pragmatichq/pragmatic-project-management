"use client";

import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";

import { useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { ProjectDetails } from "@/components/projects/project-details";

import { Id } from "@/convex/_generated/dataModel";

export default function SingleProjectPage({
  params,
}: {
  params: { project_id: Id<"projects"> };
}) {
  let loading = true;
  const { orgId } = useAuth();

  const activeOrgId: string = orgId ?? "";

  const project = useQuery(api.projects.get, {
    id: params.project_id,
  });

  const tasks = useQuery(api.tasks.list, {
    project: params.project_id,
  });

  if (project === undefined) {
    loading = true;
  } else {
    loading = false;
  }
  if (!project && !loading) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {project == undefined ? (
        <LoadingSpinner />
      ) : (
        <ProjectDetails project={project} tasks={tasks} />
      )}
    </main>
  );
}
