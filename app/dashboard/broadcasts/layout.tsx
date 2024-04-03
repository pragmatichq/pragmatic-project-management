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
    <div className="flex flex-col space-y-4 p-4">
      <h2 className="text-4xl font-bold tracking-tight">Broadcasts</h2>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <BroadcastSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
