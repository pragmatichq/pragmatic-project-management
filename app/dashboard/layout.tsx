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
import { LayoutContext } from "./_contexts/LayoutContext";
import LayoutTitle from "@/components/shared/LayoutTitle";

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
              <LayoutContext.Provider
                value={{
                  breadcrumbs,
                  setBreadcrumbs,
                }}
              >
                <LayoutTitle />
                {children}
              </LayoutContext.Provider>
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
