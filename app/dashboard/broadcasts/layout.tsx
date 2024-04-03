import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import BroadcastSidebar from "./_components/BroadcastSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import LayoutTitle from "@/components/shared/LayoutTitle";

export default function BroadcastTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LayoutTitle title="Broadcasts" />
      <ResizablePanelGroup direction="horizontal" autoSaveId="broadcast">
        <ResizablePanel defaultSize={30} minSize={20}>
          <ScrollArea className="h-screen">
            <BroadcastSidebar />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <ScrollArea className="h-screen">
            <div className="flex flex-col space-y-4 p-6">{children}</div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
