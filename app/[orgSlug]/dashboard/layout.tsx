"use client";

import React from "react";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/navigation/sidebar";
import { cn } from "@/lib/utils";
import {
  Inbox,
  ListChecks,
  CopyCheck,
  Map,
  PartyPopper,
  Archive,
} from "lucide-react";
import { AuthLoading, Authenticated } from "convex/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@clerk/nextjs";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { orgSlug } = useAuth();

  return (
    <>
      <Authenticated>
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            autoSaveId="dashboard-layout"
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes
              )}`;
            }}
            className="h-full items-stretch"
          >
            <ResizablePanel
              defaultSize={10}
              collapsedSize={3}
              collapsible={true}
              minSize={10}
              maxSize={14}
              onCollapse={() => {
                setIsCollapsed(true);
              }}
              onExpand={() => {
                setIsCollapsed(false);
              }}
              className={cn(
                "h-screen flex flex-col",
                isCollapsed &&
                  "min-w-[50px] transition-all duration-300 ease-in-out"
              )}
            >
              <div
                className={cn(
                  "flex h-[52px] items-center",
                  isCollapsed
                    ? "ml-[10px] justify-start"
                    : "px-2 justify-center"
                )}
              >
                <OrganizationSwitcher
                  hidePersonal
                  afterSelectOrganizationUrl={"/" + orgSlug + "/dashboard"}
                />
              </div>
              <Separator />
              <Sidebar
                isCollapsed={isCollapsed}
                links={[
                  {
                    title: "Inbox",
                    label: "",
                    icon: Inbox,
                    url: "/" + orgSlug + "/dashboard",
                  },
                  {
                    title: "Actions",
                    label: "",
                    icon: CopyCheck,
                    url: "/" + orgSlug + "/dashboard/actions",
                  },
                  {
                    title: "Initiatives",
                    label: "",
                    icon: ListChecks,
                    url: "/" + orgSlug + "/dashboard/initiatives",
                  },
                  {
                    title: "Roadmap",
                    label: "",
                    icon: Map,
                    url: "/" + orgSlug + "/dashboard/roadmap",
                  },
                  {
                    title: "Broadcasts",
                    label: "",
                    icon: PartyPopper,
                    url: "/" + orgSlug + "/dashboard/broadcasts",
                  },
                  {
                    title: "Files",
                    label: "",
                    icon: Archive,
                    url: "/" + orgSlug + "/dashboard/files",
                  },
                ]}
              />
              <Separator />
              <div
                className={cn(
                  "flex h-[52px] items-center",
                  isCollapsed ? "ml-[10px]" : "px-2"
                )}
              >
                <UserButton />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={90}>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </Authenticated>
      <AuthLoading>
        <LoadingSpinner />
      </AuthLoading>
    </>
  );
}
