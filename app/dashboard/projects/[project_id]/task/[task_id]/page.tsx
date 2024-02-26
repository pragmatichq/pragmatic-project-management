"use client";
import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";

import { useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatusSelector } from "../../../_components/status-selector";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from "../../_components/task-list";

export default function SingleProject({
  params,
}: {
  params: { project_id: string; task_id: string };
}) {
  let loading = true;
  const { orgId } = useAuth();

  const router = useRouter();

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

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      router.back();
    }
  }, [open]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {project == undefined ? (
        <LoadingSpinner />
      ) : (
        <div>
          <Dialog defaultOpen open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-6xl h-[90%]">
              <DialogHeader>
                <DialogDescription>{project.title}</DialogDescription>
                <DialogTitle>{activeTask?.title}</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
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
                <CardContent>
                  <TaskList tasks={tasks} />
                </CardContent>
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
