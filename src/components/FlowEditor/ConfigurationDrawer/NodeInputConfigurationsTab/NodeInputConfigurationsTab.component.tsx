import { ModuleSpecsInputs, NodeConfiguration } from "@ecoflow/types";
import { useEffect, useState } from "react";
import { Button } from "rsuite";

interface NodeInputConfigurationsTabProps {
  nodeInputs?: ModuleSpecsInputs[];
  nodeConfigurations?: NodeConfiguration["configs"];
  onChange?: (value: NodeConfiguration["configs"]) => void;
}

export default function NodeInputConfigurationsTab({
  nodeConfigurations,
  onChange = () => {},
}: NodeInputConfigurationsTabProps) {
  const [nodeConfiguration, setNodeConfiguration] = useState(
    nodeConfigurations || {}
  );

  useEffect(() => onChange(nodeConfiguration), [nodeConfiguration]);
  return (
    <Button onClick={() => setNodeConfiguration({ abc: true })}> sfdg</Button>
  );
}
