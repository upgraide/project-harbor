import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@harbor-app/ui/components/resizable";
import { MergersAndAcquisitionsPanel } from "../components/mergers-and-acquisitions-panel";

export const MergersAndAcquisitionsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
      <ResizablePanel defaultSize={30} maxSize={30} minSize={20}>
        <MergersAndAcquisitionsPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full" defaultSize={70}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
