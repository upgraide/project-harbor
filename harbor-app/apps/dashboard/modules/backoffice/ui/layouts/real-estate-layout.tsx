import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@harbor-app/ui/components/resizable";
import { RealEstatePanel } from "../components/real-estate-panel";

export const RealEstateLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
      <ResizablePanel defaultSize={30} maxSize={30} minSize={20}>
        <RealEstatePanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full" defaultSize={70}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
