"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { StatusSelector } from "@/components/shared/status-selector";
import { TaskList } from "@/components/tasks/task-list";

export function ProjectDetails({
  project,
  tasks,
}: {
  project: any;
  tasks: any;
}) {
  return (
    <div>
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">{project?.title}</h1>
      </div>
      <div className="py-4">
        <StatusSelector
          currentStatus={project?.status}
          projectID={project?._id}
          statuses={["In Progress", "Next Up", "Consideration"]}
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
  );
}
