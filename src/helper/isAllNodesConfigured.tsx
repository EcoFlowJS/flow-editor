import {
  Descriptions,
  FlowDefinitions,
  FlowsDescription,
  Nodes,
} from "@ecoflow/types";
import has from "lodash/has";

const isAllNodesConfigured = (
  definitions: FlowDefinitions | FlowsDescription
): boolean => {
  const nodes: Nodes = [];
  Object.keys(definitions).map((key) => {
    if (has(definitions[key], "definitions"))
      nodes.push(...(definitions[key] as Descriptions).definitions);
    else nodes.push(...(definitions[key] as Nodes));
  });

  if (nodes.filter((n) => !n.data.configured).length > 0) return false;

  return true;
};

export default isAllNodesConfigured;
