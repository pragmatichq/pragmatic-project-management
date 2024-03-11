"use client";

import { notFound } from "next/navigation";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProjectDetails } from "@/components/projects/project-details";

interface SingleProjectPageProps {
  params: { project_id: Id<"tasks"> };
}

export default function SingleProjectPage({ params }: SingleProjectPageProps) {
  let project: Doc<"tasks"> | undefined;

  try {
    project = useQuery(api.tasks.get, {
      id: params.project_id,
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes("ArgumentValidationError")) {
      notFound();
    } else {
      throw e;
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {!project ? <LoadingSpinner /> : <ProjectDetails project={project} />}
    </main>
  );
}
