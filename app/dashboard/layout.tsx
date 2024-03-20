"use client";

import React from "react";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/navigation/sidebar";
import { cn } from "@/lib/utils";
import {
  Inbox,
  CheckSquare,
  FolderCheck,
  Map,
  PartyPopper,
  Archive,
} from "lucide-react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  console.log(isCollapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        autoSaveId="dashboard-layout"
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-fullmax-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={10}
          collapsedSize={3}
          collapsible={true}
          minSize={10}
          maxSize={12}
          onCollapse={() => {
            setIsCollapsed(true);
          }}
          onExpand={() => {
            setIsCollapsed(false);
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center",
              isCollapsed ? "ml-[10px] justify-start" : "px-2 justify-center"
            )}
          >
            <OrganizationSwitcher hidePersonal />
          </div>
          <Separator />
          <Sidebar
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Inbox",
                label: "",
                icon: Inbox,
                url: "/dashboard",
              },
              {
                title: "Actions",
                label: "",
                icon: CheckSquare,
                url: "/dashboard/actions",
              },
              {
                title: "Initiatives",
                label: "",
                icon: FolderCheck,
                url: "/dashboard/initiatives",
              },
              {
                title: "Roadmap",
                label: "",
                icon: Map,
                url: "/dashboard/roadmap",
              },
              {
                title: "Broadcasts",
                label: "",
                icon: PartyPopper,
                url: "/dashboard/broadcasts",
              },
              {
                title: "Files",
                label: "",
                icon: Archive,
                url: "/dashboard/files",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
