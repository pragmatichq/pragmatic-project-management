"use client";

import { useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/convex/_generated/api";

import { NewProjectForm } from "@/components/projects/project-creation-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProjectList } from "@/components/projects/project-list";

export default function ProjectListPage() {
  const { orgId } = useAuth();
  const activeOrgId: string = orgId ?? "";
  const projects = useQuery(api.projects.list, {});

  const statusOptions = ["In Progress", "Next Up", "Consideration"];

  const filteredProjects = statusOptions.map((status) => ({
    status,
    projects: projects?.filter((project) => project.status === status),
  }));

  return (
    <main>
      <section className="p-5">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects != null ? (
              filteredProjects.map((filter) => (
                <ProjectList
                  key={filter.status}
                  projects={filter.projects}
                  headerName={filter.status}
                />
              ))
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
