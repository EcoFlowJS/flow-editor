import { FlexboxGrid, Loader } from "rsuite";
import FlowHeader from "./FlowHeader/FlowHeader.component";
import { useEffect, useState } from "react";
import Editor from "./Editor/Editor.component";
import { useSetAtom } from "jotai";
import { flowEditor, flowEditorSettings } from "../../store/flowEditor.store";
import getFlows from "../../service/flows/getFlows.services";
import flowEditorHandlers from "../../hooks/flowEditorHandlers.hook";
import fetchFlowSetting from "../../service/flows/fetchFlowSetting.service";
import { ApiResponse } from "@ecoflow/types";

export default function FlowEditor() {
  const hnl = flowEditorHandlers();
  const [isLoading, setLoading] = useState({ flow: true, flowSettings: true });
  const [flow, setFlow] = useState("");
  const setFlows = useSetAtom(flowEditor);
  const setFlowSettings = useSetAtom(flowEditorSettings);

  useEffect(() => {
    getFlows().then(
      (response: ApiResponse) => {
        setLoading((loading) => {
          return { ...loading, flow: false };
        });
        if (response.success) setFlows(response.payload);
      },
      (error: ApiResponse) => {
        setLoading((loading) => {
          return { ...loading, flow: false };
        });
        console.error(error.payload);
      }
    );

    fetchFlowSetting().then(
      (response: ApiResponse) => {
        setLoading((loading) => {
          return { ...loading, flowSettings: false };
        });
        if (response.success)
          setFlowSettings((settings) => {
            return { ...settings, ...response.payload };
          });
      },
      (reject: ApiResponse) => {
        setLoading((loading) => {
          return { ...loading, flowSettings: false };
        });
        console.error(reject.payload);
      }
    );
  }, []);

  useEffect(() => console.log(hnl.flowEditorValue), [hnl.flowEditorValue]);

  return (
    <>
      <FlexboxGrid style={{ alignContent: "stretch", position: "relative" }}>
        {isLoading.flow || isLoading.flowSettings ? (
          <Loader backdrop center content="vertical Loading..." vertical />
        ) : (
          <></>
        )}
        <FlexboxGrid.Item colspan={24}>
          <FlowHeader
            onFlowSelect={setFlow}
            disabled={isLoading.flow || isLoading.flowSettings}
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          colspan={24}
          style={{ height: "calc(100vh - 105px)" }}
        >
          <Editor
            flow={flow}
            disabled={isLoading.flow || isLoading.flowSettings}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  );
}
