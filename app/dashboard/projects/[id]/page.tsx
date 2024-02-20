"use client";
import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";

import { useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatusSelector } from "../_components/status-selector";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page({ params }: { params: { id: string } }) {
  let loading = true;
  const { orgId } = useAuth();

  const activeOrgId: string = orgId ?? "";

  const project = useQuery(api.projects.getProject, {
    organization: activeOrgId,
    _id: params.id,
  });

  const tasks = useQuery(api.tasks.getTasksByProject, {
    organization: activeOrgId,
    project: params.id,
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
        <div>
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">
              {project?.title}
            </h1>
          </div>
          <div className="py-4">
            <StatusSelector
              currentStatus={project?.status}
              projectID={project?._id}
            />
          </div>

          <Tabs defaultValue="tasks">
            <TabsList className="grid w-1/2 grid-cols-3">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent>{tasks?.map((task) => task.title)}</CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="discussions">
              <Card>
                <CardHeader>
                  <CardTitle>Discussions</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle>Files</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </main>
  );
}
