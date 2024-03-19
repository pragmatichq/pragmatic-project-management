import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ResizablePanelGroup
        autoSaveId="mainLayout"
        direction="horizontal"
        className="items-stretch z-0"
      >
        <ResizablePanel defaultSize={11} minSize={11} maxSize={14}>
          <div className="flex flex-col h-screen">
            <div className="flex-none p-3">
              <OrganizationSwitcher />
            </div>
            <Separator className="flex-none" />
            <ScrollArea className="grow p-3 flex">
              <Link href="/dashboard">Inbox</Link>
              <br />
              <Link href="/dashboard">Actions</Link>
              <br />
              <Link href="/dashboard">Initiatives</Link>
              <br />
              <Link href="/dashboard/roadmap">Roadmap</Link>
              <br />
              <Link href="/dashboard">Broadcasts</Link>
            </ScrollArea>
            <Separator className="flex-none" />
            <div className="flex-none p-3">
              <UserButton />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
