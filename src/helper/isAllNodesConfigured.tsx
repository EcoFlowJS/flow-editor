import {
  Describtions,
  FlowDefinitions,
  FlowsConfigurations,
  Nodes,
} from "@ecoflow/types";
import has from "lodash/has";

const isAllNodesConfigured = (
  definitions: FlowDefinitions | FlowsConfigurations
): boolean => {
  const nodes: Nodes = [];
  Object.keys(definitions).map((key) => {
    if (has(definitions[key], "definitions"))
      nodes.push(...(definitions[key] as Describtions).definitions);
    else nodes.push(...(definitions[key] as Nodes));
  });

  if (nodes.filter((n) => !n.data.configured).length > 0) return false;

  return true;
};

export default isAllNodesConfigured;
