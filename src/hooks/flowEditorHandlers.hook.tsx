import { useAtomValue, useSetAtom } from "jotai";
import { flowEditor } from "../store/flowEditor.store";
import { FlowRenameConfigurations } from "@ecoflow/types";

const flowEditorHandlers = () => {
  const flowEditorValue = useAtomValue(flowEditor);
  const setFlowEditor = useSetAtom(flowEditor);
  const clear = () => setFlowEditor({});
  const removeFlow = (flowName: string) =>
    setFlowEditor((flowEditor) => {
      if (flowEditor.renamedFlows)
        flowEditor.renamedFlows = flowEditor.renamedFlows.filter(
          (renameFlow) => renameFlow.oldName !== flowName
        );

      if (flowEditor.addFlows && flowEditor.addFlows.includes(flowName)) {
        flowEditor.addFlows = flowEditor.addFlows.filter(
          (name) => name !== flowName
        );
        return { ...flowEditor };
      }
      return {
        ...flowEditor,
        removedFlows: [
          ...(flowEditor.removedFlows ? flowEditor.removedFlows : []),
          flowName,
        ],
      };
    });

  const renameFlow = (flowNames: FlowRenameConfigurations) =>
    setFlowEditor((flowEditor) => {
      if (flowEditor.addFlows?.includes(flowNames.newName))
        throw "Flow already exists.";

      if (flowEditor.addFlows?.includes(flowNames.oldName)) {
        flowEditor.addFlows.splice(
          flowEditor.addFlows.indexOf(flowNames.oldName),
          1,
          flowNames.newName
        );
        return { ...flowEditor };
      }
      return {
        ...flowEditor,
        renamedFlows: [
          ...(flowEditor.renamedFlows ? flowEditor.renamedFlows : []),
          flowNames,
        ],
      };
    });

  const addFlows = (flowName: string) =>
    setFlowEditor((flowEditor) => {
      if (flowEditor.addFlows?.includes(flowName)) throw "Flow already exists.";
      if (
        flowEditor.renamedFlows &&
        flowEditor.renamedFlows.filter((names) => names.newName === flowName)
          .length > 0
      )
        throw "Flow already exists.";
      return {
        ...flowEditor,
        addFlows: [
          ...(flowEditor.addFlows ? flowEditor.addFlows : []),
          flowName,
        ],
      };
    });

  return {
    flowEditorValue,
    clear,
    removeFlow,
    renameFlow,
    addFlows,
  };
};

export default flowEditorHandlers;
