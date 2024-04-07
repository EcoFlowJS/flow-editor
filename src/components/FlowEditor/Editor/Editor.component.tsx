import { DragEvent } from "react";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import flowEditorHandlers from "../../../hooks/flowEditorHandlers.hook";
import flowNodeTypes from "../../../defaults/flowNodeTypes.default";
import "reactflow/dist/style.css";
import "./style.less";

interface EditorProps {
  flow?: string;
  disabled?: boolean;
}
let id = 0;
const getId = (nodeID: string) => `${nodeID}_${id++}`;

export default function Editor({ flow = "", disabled = false }: EditorProps) {
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [lastFlow, setLastFlow] = useState("");
  const [activeFlow, setActiveFlow] = useState("");
  const flowHandlers = flowEditorHandlers();

  const onConnect = useCallback(
    (existingConnections: Edge | Connection) =>
      setEdges((connections) =>
        addEdge({ ...existingConnections }, connections)
      ),
    []
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const { nodeID, type, label } = JSON.parse(
        event.dataTransfer.getData("application/ecoflow/nodes")
      );

      if (typeof type === "undefined" || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(nodeID._id),
        type,
        position,
        data: {
          nodeID,
          label,
          openDrawer: (id: any) => console.log(id),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    if (isEmpty(flow)) return;
    setActiveFlow(flow);
    if (isEmpty(activeFlow)) setLastFlow(flow);
    else setLastFlow(activeFlow);
  }, [flow]);

  useEffect(() => {
    if (isEmpty(activeFlow) && isEmpty(lastFlow)) return;
    setNodes(flowHandlers.flowEditorValue[activeFlow].definitions);
    setEdges(flowHandlers.flowEditorValue[activeFlow].connections);

    flowHandlers.updateFlowEditor(lastFlow, {
      definitions: nodes,
      connections: edges,
      configurations: [],
    });
  }, [activeFlow]);

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={flowNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={disabled ? undefined : onDrop}
        snapToGrid
        snapGrid={[20, 20]}
        onDragOver={disabled ? undefined : onDragOver}
        fitView
        attributionPosition="top-right"
        nodesDraggable={!disabled}
        nodesConnectable={!disabled}
        elementsSelectable={!disabled}
        zoomOnScroll={!disabled}
        panOnDrag={!disabled}
        deleteKeyCode="Delete"
      >
        <MiniMap zoomable={!disabled} pannable={!disabled} />
        <Controls />
        <Background color="#aaa" gap={20} />
      </ReactFlow>
    </ReactFlowProvider>
  );
}
