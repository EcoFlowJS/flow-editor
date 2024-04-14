import {
  ModuleSpecsInputs,
  ModuleTypes,
  NodeConfiguration,
} from "@ecoflow/types";
import { useEffect, useState } from "react";
import NodeInputs from "./NodeInputs/NodeInputs.component";

interface NodeInputConfigurationsTabProps {
  nodeType?: ModuleTypes;
  nodeInputs?: ModuleSpecsInputs[];
  nodeConfigurations?: NodeConfiguration["configs"];
  onChange?: (value: NodeConfiguration["configs"]) => void;
}

export default function NodeInputConfigurationsTab({
  nodeType = "Request",
  nodeInputs,
  nodeConfigurations,
  onChange = () => {},
}: NodeInputConfigurationsTabProps) {
  const [nodeConfiguration, _setNodeConfiguration] = useState(
    nodeConfigurations || {}
  );

  useEffect(() => onChange(nodeConfiguration), [nodeConfiguration]);
  return (
    <>
      {nodeInputs ? (
        nodeInputs.map((nodeInput, key) => (
          <div key={key}>
            <NodeInputs
              inputSpecs={nodeInput}
              isEndNode={
                nodeType === "Request" && key + 1 === nodeInputs.length
              }
              onChange={console.log}
            />
          </div>
        ))
      ) : (
        <></>
      )}
    </>
  );
}
