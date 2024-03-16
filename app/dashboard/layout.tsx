import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15}>
        <nav className="h-screen overflow-scroll p-4">
          <div>Hello</div>
        </nav>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <section className="h-screen overflow-scroll p-4">{children}</section>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
