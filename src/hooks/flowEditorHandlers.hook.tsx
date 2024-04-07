import { useAtomValue, useSetAtom } from "jotai";
import { flowEditor } from "../store/flowEditor.store";
import { Describtions } from "@ecoflow/types";
import { isUndefined } from "lodash";

const flowEditorHandlers = () => {
  const flowEditorValue = useAtomValue(flowEditor);
  const setFlowEditor = useSetAtom(flowEditor);

  const addFlow = (flowName: string) => {
    setFlowEditor((flowsConfigurations) => {
      if (Object.keys(flowsConfigurations).includes(flowName))
        throw "Flow name already exists.";

      flowsConfigurations[flowName] = {
        definitions: [],
        connections: [],
        configurations: [],
      };
      return { ...flowsConfigurations };
    });
  };

  const dropFlow = (flowName: string) =>
    setFlowEditor((flowsConfigurations) => {
      delete flowsConfigurations[flowName];
      return { ...flowsConfigurations };
    });

  const renameFlow = (fromFlowName: string, toFlowName: string) =>
    setFlowEditor((flowsConfigurations) => {
      if (Object.keys(flowsConfigurations).includes(toFlowName))
        throw "Flow name already exists.";

      const flow = { ...flowsConfigurations[fromFlowName] };
      delete flowsConfigurations[fromFlowName];
      flowsConfigurations[toFlowName] = flow;
      return { ...flowsConfigurations };
    });

  const updateFlowEditor = (
    flowName: string,
    flowsConfigurations: Describtions
  ) =>
    setFlowEditor((flow) => {
      if (!isUndefined(flow[flowName])) flow[flowName] = flowsConfigurations;
      return { ...flow };
    });

  return {
    flowEditorValue,
    addFlow,
    dropFlow,
    renameFlow,
    updateFlowEditor,
  };
};

export default flowEditorHandlers;
