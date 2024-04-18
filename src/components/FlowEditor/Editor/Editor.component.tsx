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
  updateEdge,
} from "reactflow";
import flowEditorHandlers from "../../../hooks/flowEditorHandlers.hook";
import flowNodeTypes from "../../../defaults/flowNodeTypes.default";
import {
  EcoModuleID,
  FlowsEdgeDataTypes,
  FlowsNodeDataTypes,
  NodeAppearanceConfigurations,
  NodeConfiguration,
} from "@ecoflow/types";
import { useAtomValue, useSetAtom } from "jotai";
import {
  currentFlowConfigurations,
  currentFlowEdges,
  currentFlowNodes,
  flowEditorConfigurationsDrawer,
  flowEditorSettings,
} from "../../../store/flowEditor.store";
import ConfigurationDrawer from "../ConfigurationDrawer/ConfigurationDrawer.component";
import "reactflow/dist/style.css";
import "./style.less";
import defaultNodeAppearance from "../../../defaults/defaultNodeAppearance.default";

interface EditorProps {
  flow?: string;
  disabled?: boolean;
}
let id = 0;
const getId = (moduleID: string) => `${moduleID}_${id++}`;

export default function Editor({ flow = "", disabled = false }: EditorProps) {
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowsNodeDataTypes>(
    []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowsEdgeDataTypes>(
    []
  );
  const [nodeConfigurations, setNodeConfigurations] = useState<
    NodeConfiguration[]
  >([]);
  const [lastFlow, setLastFlow] = useState("");
  const [activeFlow, setActiveFlow] = useState("");
  const setCurrentFlowNodes = useSetAtom(currentFlowNodes);
  const setCurrentFlowEdges = useSetAtom(currentFlowEdges);
  const setCurrentFlowConfigurations = useSetAtom(currentFlowConfigurations);
  const openDrawer = useSetAtom(flowEditorConfigurationsDrawer);
  const flowSettings = useAtomValue(flowEditorSettings);
  const flowHandlers = flowEditorHandlers();

  const openConfigurationDrawer = (
    nodeID: string,
    moduleID: EcoModuleID,
    label: string,
    configured: boolean,
    disabled: boolean,
    description: string,
    appearance: NodeAppearanceConfigurations
  ) =>
    openDrawer({
      show: true,
      nodeID,
      moduleID,
      label,
      configured,
      disabled,
      description,
      appearance,
    });

  const onConnect = useCallback(
    (connections: Edge | Connection) => {
      if (connections.source === connections.target) return false;

      const targetNodeIDs = edges
        .filter((edge) => edge.source === connections.source)
        .map((e) => e.target);

      if (
        nodes.filter(
          (node) => targetNodeIDs.includes(node.id) && node.type === "Response"
        ).length > 0 &&
        nodes.filter(
          (node) => node.id === connections.target && node.type === "Response"
        ).length > 0
      )
        return false;

      setEdges((existingConnections) => {
        const sourceNode = nodes.filter(
          (node) => node.id === connections.source
        )[0];
        const targetNode = nodes.filter(
          (node) => node.id === connections.target
        )[0];
        let updatedEdge = addEdge(
          {
            ...connections,
            animated:
              false || sourceNode.data.disabled || targetNode.data.disabled,
            data: { forcedDisabled: false },
          },
          existingConnections
        );

        const targetNodes = nodes.find(
          (node) => node.id === connections.target
        );
        const targetIds = updatedEdge
          .filter((e) => e.source === connections.source)
          .map((e) => e.target);

        if (
          (targetNodes && targetNodes.type === "Response") ||
          nodes.filter(
            (node) => targetIds.includes(node.id) && node.type === "Response"
          ).length > 0
        )
          updatedEdge
            .filter((edge) => edge.source === connections.source)
            .forEach((edge) => {
              const node = nodes.find((node) => node.id === edge.target);
              if (node && node.type === "Middleware")
                updatedEdge = updateEdge(
                  { ...edge, animated: true, data: { forcedDisabled: true } },
                  {
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle!,
                    targetHandle: edge.target!,
                  },
                  updatedEdge
                );
            });

        return updatedEdge;
      });
    },
    [nodes, edges]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge<FlowsEdgeDataTypes>[]) => {
      deletedEdges.forEach((edge) => {
        const targetedNodesID = edges
          .filter((e) => e.source === edge.source && e.target !== edge.target)
          .map((e) => e.target);

        const targetNodesIsResponse =
          nodes.filter(
            (node) =>
              targetedNodesID.includes(node.id) && node.type === "Response"
          ).length > 0;

        if (!targetNodesIsResponse) {
          const middlewareNodesIDs = nodes
            .filter(
              (node) =>
                targetedNodesID.includes(node.id) && node.type === "Middleware"
            )
            .map((node) => node.id);

          edges
            .filter((e) => middlewareNodesIDs.includes(e.target))
            .forEach((edge) => {
              const sourceNode = nodes.filter(
                (node) => node.id === edge.source
              )[0];
              const targetNode = nodes.filter(
                (node) => node.id === edge.target
              )[0];

              setEdges((els) =>
                updateEdge(
                  {
                    ...edge,
                    animated:
                      false ||
                      sourceNode.data.disabled ||
                      targetNode.data.disabled,
                    data: { forcedDisabled: false },
                  },
                  {
                    source: edge.source,
                    target: edge.target,
                    targetHandle: edge.targetHandle!,
                    sourceHandle: edge.sourceHandle!,
                  },
                  els
                )
              );
            });
        }
      });
    },
    [nodes, edges]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const { moduleID, type, label, configured } = JSON.parse(
        event.dataTransfer.getData("application/ecoflow/nodes")
      );

      if (typeof type === "undefined" || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const nodeID = getId(moduleID._id);
      const newNode: Node<FlowsNodeDataTypes> = {
        id: nodeID,
        type,
        position,
        data: {
          moduleID,
          label,
          configured,
          disabled: false,
          description: "",
          appearance: defaultNodeAppearance,
          openDrawer: (
            label: string,
            configured: boolean,
            disabled: boolean,
            description: string,
            appearance: NodeAppearanceConfigurations
          ) =>
            openConfigurationDrawer(
              nodeID,
              moduleID,
              label,
              configured,
              disabled,
              description,
              appearance
            ),
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setNodeConfigurations((configurations) =>
        configurations.concat([{ nodeID, configs: {} }])
      );
    },
    [reactFlowInstance]
  );

  const handleDrawerClosed = (
    nodeID: string,
    label: string,
    configured: boolean,
    disabled: boolean,
    description: string,
    appearance: NodeAppearanceConfigurations,
    nodeConfiguration: NodeConfiguration
  ) => {
    setNodes((nodes) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeID)
          node.data = {
            ...node.data,
            label,
            configured,
            disabled,
            description,
            appearance,
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
          edge.animated =
            edge.data?.forcedDisabled ||
            sourceNode.data.disabled ||
            targetNode.data.disabled;

          return { ...edge };
        })
      );

      setNodeConfigurations((configurations) =>
        configurations.map((configuration) => {
          if (configuration.nodeID === nodeID)
            configuration.configs = nodeConfiguration.configs;

          return { ...configuration };
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
    setNodeConfigurations(
      flowHandlers.flowEditorValue[activeFlow].configurations
    );

    flowHandlers.updateFlowEditor(lastFlow, {
      definitions: nodes,
      connections: edges,
      configurations: nodeConfigurations,
    });
  }, [activeFlow]);

  useEffect(() => setCurrentFlowNodes(nodes), [nodes]);
  useEffect(() => setCurrentFlowEdges(edges), [edges]);
  useEffect(
    () => setCurrentFlowConfigurations(nodeConfigurations),
    [nodeConfigurations]
  );

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
            onEdgesDelete={onEdgesDelete}
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
      <ConfigurationDrawer
        configuration={nodeConfigurations}
        onDrawerClosed={handleDrawerClosed}
      />
    </>
  );
}
