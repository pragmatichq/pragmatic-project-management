"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { NewProjectForm } from "@/components/projects/project-creation-form";
import { ProjectList } from "@/components/projects/project-list";
import { Doc } from "@/convex/_generated/dataModel";

export default function ProjectListPage() {
  let projects: Array<Doc<"projects">> | undefined;

  try {
    projects = useQuery(api.projects.list, {});
  } catch (e) {
    throw e;
  }

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
            {filteredProjects ? (
              filteredProjects.map((filter) => (
                <ProjectList
                  key={filter.status}
                  projects={filter.projects || []}
                  headerName={filter.status}
                />
              ))
            ) : (
              <LoadingSpinner />
            )}
            <NewProjectForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
