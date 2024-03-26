"use client";

import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthLoading, Authenticated } from "convex/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DashboardNavigation } from "./_components/DashboardNavigation";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Authenticated>
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            autoSaveId="dashboard-layout"
            direction="horizontal"
            className="h-full items-stretch"
          >
            <DashboardNavigation panelDefaultSize={10} />
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
