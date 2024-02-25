"use client";

import { useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/convex/_generated/api";

import { NewProjectForm } from "./_components/new-project-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProjectList } from "./_components/project-list";

export default function Component() {
  const { orgId } = useAuth();
  const activeOrgId: string = orgId ?? "";
  const projects = useQuery(api.projects.getProjectList, {
    organization: activeOrgId,
  });
  const inProgressProjects = projects?.filter(
    (project) => project.status == "In Progress"
  );
  const nextUpProjects = projects?.filter(
    (project) => project.status == "Next Up"
  );
  const considerationProjects = projects?.filter(
    (project) => project.status == "Consideration"
  );

  return (
    <main>
      <section className="p-5">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects != null ? (
              <section>
                <ProjectList
                  projects={inProgressProjects}
                  headerName="In Progress"
                />
                <ProjectList projects={nextUpProjects} headerName="Next Up" />
                <ProjectList
                  projects={considerationProjects}
                  headerName="Consideration"
                />
              </section>
            ) : (
              <LoadingSpinner />
            )}
            <NewProjectForm activeOrgId={activeOrgId} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
