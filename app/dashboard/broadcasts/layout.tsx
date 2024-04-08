"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import BroadcastSidebar from "./_components/BroadcastSidebar";

export default function BroadcastTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="broadcast">
      <ResizablePanel defaultSize={30} minSize={20}>
        <div className="p-6 h-[calc(100vh-45px)] overflow-auto">
          <BroadcastSidebar />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex flex-col space-y-4 p-6 h-[calc(100vh-45px)] overflow-auto">
          {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
