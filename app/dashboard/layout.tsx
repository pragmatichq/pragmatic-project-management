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
import { Input } from "@/components/ui/input";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const projects = useQuery(api.projects.list, {});

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
                <HomeIcon className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="group"
              >
                <div className="flex">
                  <Link
                    href="/dashboard/projects/"
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
                  >
                    <FolderIcon className="w-5 h-5 mr-3" />
                    Projects
                  </Link>
                  <CollapsibleTrigger className="ml-auto">
                    <ChevronDownIcon className="h-5 w-5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-200 group-data-[state=closed]:-rotate-90 group-data-[state=open]:rotate-0" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  {projects?.length == 0 ? (
                    <div className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 ml-6">
                      No Projects
                    </div>
                  ) : (
                    projects?.map((project) => (
                      <Link
                        className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
                        href={"/dashboard/projects/" + project._id}
                        key={project._id}
                      >
                        <span className="ml-6">{project.title}</span>
                      </Link>
                    ))
                  )}
                </CollapsibleContent>
              </Collapsible>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-800">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" href="#">
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                  placeholder="Search projects..."
                  type="search"
                />
              </div>
            </form>
          </div>
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

function FolderIcon(props: any) {
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
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}

function HomeIcon(props: any) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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
