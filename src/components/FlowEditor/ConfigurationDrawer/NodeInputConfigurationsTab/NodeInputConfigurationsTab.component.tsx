import { ModuleSpecsInputs, NodeConfiguration } from "@ecoflow/types";
import { useEffect, useState } from "react";
import NodeInputs from "./NodeInputs/NodeInputs.component";

interface NodeInputConfigurationsTabProps {
  nodeInputs?: ModuleSpecsInputs[];
  nodeConfigurations?: NodeConfiguration["configs"];
  onChange?: (value: NodeConfiguration["configs"]) => void;
}

export default function NodeInputConfigurationsTab({
  nodeInputs,
  nodeConfigurations = {},
  onChange = () => {},
}: NodeInputConfigurationsTabProps) {
  const [nodeConfiguration, setNodeConfiguration] = useState<{
    [key: string]: any;
  }>({});

  const handleNodeInputChange = (id: string, validated: boolean, value: any) =>
    setNodeConfiguration((nodeConfigurations) => {
      nodeConfigurations[id] = {
        validated,
        value,
      };

      return { ...nodeConfigurations };
    });

  useEffect(() => onChange(nodeConfiguration), [nodeConfiguration]);

  return (
    <>
      {nodeInputs ? (
        nodeInputs.map((nodeInput, key) => (
          <div key={key}>
            <NodeInputs
              inputSpecs={nodeInput}
              nodeConfigurations={nodeConfigurations}
              onChange={handleNodeInputChange}
            />
          </div>
        ))
      ) : (
        <></>
      )}
    </>
  );
}
