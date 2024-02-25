"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TaskList } from "./projects/[id]/_components/task-list";

export default function Component() {
  const { orgId, userId } = useAuth();

  const activeOrgId: string = orgId ?? "";

  const tasks = useQuery(api.tasks.getTasksByOrganization, {
    organization: activeOrgId,
  });

  const userTasks = tasks?.filter((task) =>
    task.assignees?.find((assignee) => assignee == userId)
  );

  return (
    <main>
      <section className="p-5">
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {userTasks == undefined ? (
              <LoadingSpinner />
            ) : (
              <TaskList tasks={userTasks} />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
