import { useMemo } from "react";
import {
  Handle,
  HandleProps,
  getConnectedEdges,
  useNodeId,
  useStore,
} from "reactflow";

const selector = (s: any) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

interface NodeTargetHandlerProps extends Omit<HandleProps, "isConnectable"> {
  isConnectable?: number;
}

export default function NodeTargetHandler(props: NodeTargetHandlerProps) {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  const isHandleConnectable = useMemo(() => {
    if (typeof props.isConnectable === "number") {
      const node = nodeInternals.get(nodeId);
      const connectedEdges = getConnectedEdges([node], edges);

      return connectedEdges.length < props.isConnectable;
    }

    return props.isConnectable;
  }, [nodeInternals, edges, nodeId, props.isConnectable]);

  return <Handle {...props} isConnectable={isHandleConnectable}></Handle>;
}
