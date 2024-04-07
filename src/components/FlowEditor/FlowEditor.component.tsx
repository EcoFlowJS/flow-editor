import { FlexboxGrid } from "rsuite";
import FlowHeader from "./FlowHeader/FlowHeader.component";
import { useState } from "react";
import Editor from "./Editor/Editor.component";

export default function FlowEditor() {
  const [flow, setFlow] = useState("");

  return (
    <>
      <FlexboxGrid style={{ alignContent: "stretch" }}>
        <FlexboxGrid.Item colspan={24}>
          <FlowHeader onFlowSelect={setFlow} />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          colspan={24}
          style={{ height: "calc(100vh - 105px)" }}
        >
          <Editor flow={flow} />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  );
}
