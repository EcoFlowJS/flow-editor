import { FlexboxGrid, Loader } from "rsuite";
import FlowHeader from "./FlowHeader/FlowHeader.component";
import { useEffect, useState } from "react";
import Editor from "./Editor/Editor.component";
import { useSetAtom } from "jotai";
import { flowEditor } from "../../store/flowEditor.store";
import getFlows from "../../service/flows/getFlows.services";
import flowEditorHandlers from "../../hooks/flowEditorHandlers.hook";

export default function FlowEditor() {
  const hnl = flowEditorHandlers();
  const [isLoading, setLoading] = useState(true);
  const [flow, setFlow] = useState("");
  const setFlows = useSetAtom(flowEditor);

  useEffect(() => {
    getFlows().then(
      (response) => {
        setLoading(false);
        if (response.success) setFlows(response.payload);
      },
      (error) => {
        setLoading(false);
        console.error(error);
      }
    );
  }, []);

  useEffect(() => console.log(hnl.flowEditorValue), [hnl.flowEditorValue]);

  return (
    <>
      <FlexboxGrid style={{ alignContent: "stretch", position: "relative" }}>
        {isLoading ? (
          <Loader backdrop center content="vertical Loading..." vertical />
        ) : (
          <></>
        )}
        <FlexboxGrid.Item colspan={24}>
          <FlowHeader onFlowSelect={setFlow} disabled={isLoading} />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          colspan={24}
          style={{ height: "calc(100vh - 105px)" }}
        >
          <Editor flow={flow} disabled={isLoading} />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  );
}
