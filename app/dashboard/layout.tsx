"use client";

import React from "react";

import { api } from "@/convex/_generated/api";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import { useQuery } from "convex/react";

import Link from "next/link";

import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@/components/ui/collapsible";

import {
  FolderIcon,
  LayoutDashboardIcon,
  TargetIcon,
  Megaphone,
} from "lucide-react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const tasks = useQuery(api.tasks.list, {});

  const filteredtasks = tasks?.filter(
    (project) => project.status === "In Progress"
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[240px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <OrganizationSwitcher hidePersonal />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto">
              <Link
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
                href="/dashboard/"
              >
                <LayoutDashboardIcon className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/planning/"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
              >
                <TargetIcon className="w-5 h-5 mr-3" />
                Planning
              </Link>
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="group"
              >
                <div className="flex">
                  <Link
                    href="/dashboard/tasks/"
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
                  >
                    <FolderIcon className="w-5 h-5 mr-3" />
                    Active tasks
                  </Link>
                  <CollapsibleTrigger className="ml-auto">
                    <ChevronDownIcon className="h-5 w-5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-200 group-data-[state=closed]:-rotate-90 group-data-[state=open]:rotate-0" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <Link
                    className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
                    href={"/dashboard/tasks/"}
                  >
                    <span className="ml-6">All Active tasks</span>
                  </Link>
                  {filteredtasks?.length == 0 ? (
                    <div className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 ml-6">
                      No tasks
                    </div>
                  ) : (
                    filteredtasks?.map((project) => (
                      <Link
                        className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
                        href={"/dashboard/tasks/" + project._id}
                        key={project._id}
                      >
                        <span className="ml-6">{project.title}</span>
                      </Link>
                    ))
                  )}
                </CollapsibleContent>
              </Collapsible>
              <Link
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
                href="/dashboard/broadcasts"
              >
                <Megaphone className="w-5 h-5 mr-3" />
                Broadcasts
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-800">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" href="#">
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1"></div>
          <UserButton afterSignOutUrl="/" />
        </header>
        {children}
      </div>
    </div>
  );
}

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
