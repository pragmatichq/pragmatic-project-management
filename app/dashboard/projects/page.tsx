"use client";

import { useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { NewProjectForm } from "./components/new-project-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProjectList } from "./components/project-list";

export default function Component() {
  const { orgId } = useAuth();
  const activeOrgId: string = orgId ?? "";
  const projects = useQuery(api.projects.getProjectList, {
    organization: activeOrgId,
  });

  return (
    <main>
      <section className="p-10">
        {projects != null ? (
          <ProjectList projects={projects} />
        ) : (
          <LoadingSpinner />
        )}
        <NewProjectForm activeOrgId={activeOrgId} />
      </section>
    </main>
  );
}
