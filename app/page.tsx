"use client";

import { Authenticated, Unauthenticated } from "convex/react";

import {
  useAuth,
  OrganizationSwitcher,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

import Link from "next/link";
import { NewProjectForm } from "./components/newProjectForm";
import { DataTableDemo } from "./components/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Home() {
  const { orgId } = useAuth();

  const activeOrgId: string = orgId ?? "";

  const projectList = useQuery(api.projects.getProjectList, {
    organization: activeOrgId,
  });

  return (
    <main>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
              <Link
                href="/examples/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Overview
              </Link>
              <Link
                href="/examples/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Customers
              </Link>
              <Link
                href="/examples/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Products
              </Link>
              <Link
                href="/examples/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Settings
              </Link>
            </nav>
            <div className="ml-auto flex items-center space-x-4">
              <Unauthenticated>
                <SignInButton mode="modal" />
              </Unauthenticated>
              <Authenticated>
                {orgId != null && <OrganizationSwitcher hidePersonal />}
                <UserButton afterSignOutUrl="/" />
              </Authenticated>
            </div>
          </div>
        </div>
        <section className="p-10">
          {projectList != null ? (
            <DataTableDemo data={projectList!} />
          ) : (
            <LoadingSpinner />
          )}
          <NewProjectForm activeOrgId={activeOrgId} />
        </section>
      </div>
    </main>
  );
}
