"use client";

import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthLoading, Authenticated } from "convex/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DashboardNavigation } from "./_components/DashboardNavigation";
import { BreadcrumbContext } from "./_contexts/BreadcrumbContext";
import DashboardBreadcrumbs from "./_components/DashboardBreadcrumbs";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  return (
    <>
      <Authenticated>
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            autoSaveId="dashboard-layout"
            direction="horizontal"
          >
            <DashboardNavigation panelDefaultSize={10} />
            <ResizableHandle />
            <ResizablePanel defaultSize={90}>
              <BreadcrumbContext.Provider
                value={{
                  breadcrumbs,
                  setBreadcrumbs,
                }}
              >
                <DashboardBreadcrumbs />
                {children}
              </BreadcrumbContext.Provider>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </Authenticated>
      <AuthLoading>
        <LoadingSpinner />
      </AuthLoading>
    </>
  );
}
