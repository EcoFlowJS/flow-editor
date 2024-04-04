import "reactflow/dist/style.css";
import { FlexboxGrid } from "rsuite";
import FlowHeader from "./FlowHeader/FlowHeader.component";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { useCallback, useEffect, useState } from "react";
import RequestNode from "./RequestNode/RequestNode.component";
import "./style.less";
import MiddlewareNode from "./MiddlewareNode/MiddlewareNode.component";
import ResponseNode from "./ResponseNode/ResponseNode.component";
import DebugNode from "./DebugNode/DebugNode.component";

const initialNodes: Node[] = [];

let id = 0;
const getId = (nodeID: string) => `${nodeID}_${id++}`;

const nodeTypes = {
  Request: RequestNode,
  Middleware: MiddlewareNode,
  Response: ResponseNode,
  Debug: DebugNode,
};

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params }, eds)),
    []
  );

  const onDragOver = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { dropEffect: string };
    }) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const { nodeID, type, label } = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(nodeID._id),
        type,
        position,
        data: { nodeID, label },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  useEffect(() => console.log(edges), [edges]);

  return (
    <>
      <FlexboxGrid style={{ alignContent: "stretch" }}>
        <FlexboxGrid.Item colspan={24}>
          <FlowHeader />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          colspan={24}
          style={{ height: "calc(100vh - 105px)" }}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              snapToGrid
              snapGrid={[20, 20]}
              onDragOver={onDragOver}
              fitView
              attributionPosition="top-right"
            >
              <MiniMap zoomable pannable />
              <Controls />
              <Background color="#aaa" gap={20} />
            </ReactFlow>
          </ReactFlowProvider>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  );
}
