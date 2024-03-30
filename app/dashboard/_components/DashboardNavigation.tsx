"use client";

import React from "react";
import { useState } from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import {
  Inbox,
  ListChecks,
  CopyCheck,
  Map,
  PartyPopper,
  Archive,
} from "lucide-react";

export function DashboardNavigation({
  panelDefaultSize,
}: {
  panelDefaultSize: number;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <ResizablePanel
      defaultSize={panelDefaultSize}
      collapsedSize={3}
      collapsible={true}
      minSize={10}
      maxSize={13}
      onCollapse={() => {
        setIsCollapsed(true);
      }}
      onExpand={() => {
        setIsCollapsed(false);
      }}
      className={cn(
        "h-screen flex flex-col",
        isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
      )}
    >
      <div
        className={cn(
          "flex-none flex h-[44px] items-center font-bold justify-start px-5"
        )}
      >
        {isCollapsed ? "P" : "Pragmatic"}
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
            icon: CopyCheck,
            url: "/dashboard/actions/",
          },
          {
            title: "Initiatives",
            label: "",
            icon: ListChecks,
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
      <Separator />
      <div
        className={cn(
          "flex h-[54px] items-center justify-start px-2",
          isCollapsed && "w-[36px] overflow-hidden"
        )}
      >
        <OrganizationSwitcher hidePersonal afterSelectOrganizationUrl={"/"} />
      </div>
    </ResizablePanel>
  );
}
