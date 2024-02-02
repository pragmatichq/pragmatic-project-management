"use client";
import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";

import { useAuth } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Page({ params }: { params: { id: string } }) {
  let loading = true;
  const { orgId } = useAuth();

  const activeOrgId: string = orgId ?? "";

  const project = useQuery(api.projects.getProject, {
    organization: activeOrgId,
    _id: params.id,
  });

  const projects = useQuery(api.projects.getProjectList, {
    organization: activeOrgId,
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
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">
              {project?.title}
            </h1>
          </div>
          <div className="shadow-sm rounded-lg">
            <p className="p-4 text-gray-500 dark:text-gray-400">
              This is a description of the project. It provides an overview of
              the project's goals, objectives, and deliverables.
            </p>
            <p className="p-4 text-gray-500 dark:text-gray-400">
              Status: In Progress
            </p>
          </div>
          <div className="p-4 rounded-lg">
            <h2 className="font-semibold text-lg md:text-xl mb-4">Tasks</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                <h3 className="font-semibold text-md mb-4">Next Up</h3>
                <div className="p-4 bg-white shadow-sm rounded-lg mb-2 border border-gray-200">
                  Task 1
                </div>
                <div className="p-4 bg-white shadow-sm rounded-lg mb-2 border border-gray-200">
                  Task 2
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                <h3 className="font-semibold text-md mb-4">In Progress</h3>
                <div className="p-4 bg-white shadow-sm rounded-lg mb-2 border border-gray-200">
                  Task 3
                </div>
                <div className="p-4 bg-white shadow-sm rounded-lg mb-2 border border-gray-200">
                  Task 4
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                <h3 className="font-semibold text-md mb-4">With External</h3>
                <div className="p-4 bg-white shadow-sm rounded-lg mb-2 border border-gray-200">
                  Task 5
                </div>
                <div className="p-4 bg-white shadow-sm rounded-lg mb-2 border border-gray-200">
                  Task 6
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                <h3 className="font-semibold text-md mb-4">Done</h3>
                <div className="p-4 bg-white shadow-sm rounded-lg mb-2 border border-gray-200">
                  Task 7
                </div>
                <div className="p-4 bg-white shadow-sm rounded-lg mb-2 border border-gray-200">
                  Task 8
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
