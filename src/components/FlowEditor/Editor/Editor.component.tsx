import { DragEvent, MouseEvent } from "react";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import flowEditorHandlers from "../../../hooks/flowEditorHandlers.hook";
import flowNodeTypes from "../../../defaults/flowNodeTypes.default";
import { EcoModuleID, FlowsDataTypes } from "@ecoflow/types";
import { useAtomValue, useSetAtom } from "jotai";
import {
  flowEditorConfigurationsDrawer,
  flowEditorSettings,
} from "../../../store/flowEditor.store";
import ConfigurationDrawer from "../ConfigurationDrawer/ConfigurationDrawer.component";
import "reactflow/dist/style.css";
import "./style.less";

interface EditorProps {
  flow?: string;
  disabled?: boolean;
}
let id = 0;
const getId = (moduleID: string) => `${moduleID}_${id++}`;

export default function Editor({ flow = "", disabled = false }: EditorProps) {
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowsDataTypes>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [lastFlow, setLastFlow] = useState("");
  const [activeFlow, setActiveFlow] = useState("");
  const openDrawer = useSetAtom(flowEditorConfigurationsDrawer);
  const flowSettings = useAtomValue(flowEditorSettings);
  const flowHandlers = flowEditorHandlers();

  const openConfigurationDrawer = (
    nodeID: string,
    moduleID: EcoModuleID,
    label: string,
    configured: boolean,
    disabled: boolean
  ) =>
    openDrawer({ show: true, nodeID, moduleID, label, configured, disabled });

  const onConnect = useCallback(
    (connections: Edge | Connection) =>
      setEdges((existingConnections) => {
        const sourceNode = nodes.filter(
          (node) => node.id === connections.source
        )[0];
        const targetNode = nodes.filter(
          (node) => node.id === connections.target
        )[0];
        return addEdge(
          {
            ...connections,
            animated: sourceNode.data.disabled || targetNode.data.disabled,
          },
          existingConnections
        );
      }),
    [nodes, edges]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const { moduleID, type, label } = JSON.parse(
        event.dataTransfer.getData("application/ecoflow/nodes")
      );

      if (typeof type === "undefined" || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const nodeID = getId(moduleID._id);
      const newNode: Node<FlowsDataTypes> = {
        id: nodeID,
        type,
        position,
        data: {
          moduleID,
          label,
          configured: false,
          disabled: false,
          openDrawer: (label: string, configured: boolean, disabled: boolean) =>
            openConfigurationDrawer(
              nodeID,
              moduleID,
              label,
              configured,
              disabled
            ),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const handleDrawerClosed = (
    nodeID: string,
    label: string,
    configured: boolean,
    disabled: boolean
  ) => {
    setNodes((nodes) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeID)
          node.data = {
            ...node.data,
            label: label,
            configured,
            disabled,
          };
        return node;
      });

      setEdges((edges) =>
        edges.map((edge) => {
          const sourceNode = updatedNodes.filter(
            (node) => node.id === edge.source
          )[0];
          const targetNode = updatedNodes.filter(
            (node) => node.id === edge.target
          )[0];
          edge.animated = sourceNode.data.disabled || targetNode.data.disabled;

          return { ...edge };
        })
      );

      return updatedNodes;
    });
  };

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
    <>
      <div
        style={{ height: "calc(100vh - 105px)" }}
        onContextMenu={(event: MouseEvent<HTMLDivElement>) =>
          event.preventDefault()
        }
      >
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
            disableKeyboardA11y={
              !disabled && !flowSettings.keyboardAccessibility
            }
            panOnScroll={flowSettings.scrollPan}
          >
            {flowSettings.miniMap ? (
              <MiniMap pannable={!disabled && flowSettings.panMiniMap} />
            ) : (
              <></>
            )}
            {flowSettings.controls ? <Controls /> : <></>}
            <Background color="#aaa" gap={20} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      <ConfigurationDrawer onDrawerClosed={handleDrawerClosed} />
    </>
  );
}
