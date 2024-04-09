import { NodeAppearanceConfigurations } from "@ecoflow/types";
import { useState } from "react";

interface NodeAppearanceTabProps {
  value?: NodeAppearanceConfigurations;
  onChange?: (value: NodeAppearanceConfigurations) => void;
}

export default function NodeAppearanceTab({
  value = {},
}: NodeAppearanceTabProps) {
  const [_nodeAppearanceConfigurations, setNodeAppearanceConfigurations] =
    useState<NodeAppearanceConfigurations>(value);

  const updatedNodesConfigurations = (value: NodeAppearanceConfigurations) => {
    setNodeAppearanceConfigurations((nodeAppearanceConfig) => {
      return {
        ...nodeAppearanceConfig,
        ...value,
      };
    });
  };
  updatedNodesConfigurations;

  return <div>NodeAppearanceTab</div>;
}
