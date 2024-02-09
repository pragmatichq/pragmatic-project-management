"use client";
import { notFound } from "next/navigation";
import React from "react";

import { api } from "@/convex/_generated/api";

import { Authenticated, Unauthenticated } from "convex/react";
import {
  SignInButton,
  OrganizationSwitcher,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

import { useQuery } from "convex/react";

import Link from "next/link";

import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

export default function Template({ children }: { children: React.ReactNode }) {
  let loading = true;
  const [isOpen, setIsOpen] = React.useState(false);

  const { orgId } = useAuth();

  const activeOrgId: string = orgId ?? "";

  const projects = useQuery(api.projects.getProjectList, {
    organization: activeOrgId,
  });

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <span className="">upMarketer</span>
            </Link>
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
                <div className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full">
                  <Link
                    href="/dashboard/projects/"
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center w-full"
                  >
                    <FolderIcon className="w-5 h-5 mr-3" />
                    Projects
                  </Link>
                  <CollapsibleTrigger className="ml-auto h-5 w-5">
                    <ChevronDownIcon className="rounded hover:bg-gray-100 hover:text-gray-600 group-data-[state=closed]:-rotate-90 group-data-[state=open]:rotate-0" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  {projects?.length == 0 ? (
                    <div className="px-2 py-2 text-sm">No Projects</div>
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
              <Link
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
                href="#"
              >
                <CalendarIcon className="w-5 h-5 mr-3" />
                Calendar
              </Link>
              <Link
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 w-full"
                href="#"
              >
                <UsersIcon className="w-5 h-5 mr-3" />
                Team
              </Link>
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
          <Unauthenticated>
            <SignInButton mode="modal" />
          </Unauthenticated>
          <Authenticated>
            {orgId != null && <OrganizationSwitcher hidePersonal />}
            <UserButton afterSignOutUrl="/" />
          </Authenticated>
        </header>
        {children}
      </div>
    </div>
  );
}

function CalendarIcon(props: any) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
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

function UsersIcon(props: any) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
