import { DragEvent, MouseEvent } from "react";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
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
import generateNodeID from "../../../helper/generateNodeID";

interface EditorProps {
  flow?: string;
  disabled?: boolean;
}

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

      /**
       * Filters the edges array to find the target node IDs that match the given source node.
       * @param {Array} edges - The array of edges to filter.
       * @param {string} connections.source - The source node to match.
       * @returns An array of target node IDs that match the given source node.
       */
      const targetNodeIDs = edges
        .filter((edge) => edge.source === connections.source)
        .map((e) => e.target);

      /**
       * Checks if there are nodes with specific IDs and types in the given array of nodes.
       * @param {Array} nodes - The array of nodes to filter through.
       * @param {Array} targetNodeIDs - The array of target node IDs to check for.
       * @param {string} connections.target - The target connection ID to check against.
       * @returns {boolean} Returns false if the conditions are met, otherwise true.
       */
      if (
        nodes.filter(
          (node) => targetNodeIDs.includes(node.id) && node.type === "Response"
        ).length > 0 &&
        nodes.filter(
          (node) => node.id === connections.target && node.type === "Response"
        ).length > 0
      )
        return false;

      /**
       * Updates the edges in the graph based on the existing connections and nodes.
       * @param {function} existingConnections - The existing connections in the graph.
       * @returns None
       */
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

        /**
         * Finds the target node based on the connection target ID and filters the updated edges
         * to get the target IDs based on the source connection.
         * @param {Array} nodes - The array of nodes to search for the target node.
         * @param {string} connections.target - The ID of the target connection.
         * @param {Array} updatedEdge - The array of updated edges to filter.
         * @param {string} connections.source - The ID of the source connection.
         * @returns {Array} An array of target nodes and an array of target IDs.
         */
        const targetNodes = nodes.find(
          (node) => node.id === connections.target
        );
        const targetIds = updatedEdge
          .filter((e) => e.source === connections.source)
          .map((e) => e.target);

        /**
         * Checks if the targetNodes type is "Response" or if any of the nodes with targetIds
         * includes the id and has a type of "Response".
         * @param {object} targetNodes - The target nodes object to check.
         * @param {array} nodes - The array of nodes to filter through.
         * @param {array} targetIds - The array of target ids to check against.
         * @returns {boolean} True if the condition is met, false otherwise.
         */
        if (
          (targetNodes && targetNodes.type === "Response") ||
          nodes.filter(
            (node) => targetIds.includes(node.id) && node.type === "Response"
          ).length > 0
        )
          /**
           * Filters the edges in the updatedEdge array based on the source property matching the connections.source value.
           * For each matching edge, if the corresponding node is of type "Middleware", updates the edge with new properties.
           * @param {Array} updatedEdge - The array of edges to filter and update.
           * @param {Object} connections - The connections object containing the source property to match.
           * @param {Array} nodes - The array of nodes to search for the target node.
           * @returns None
           */
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

        /**
         * Filters out duplicate edges from the given array of edges based on their 'id' property.
         * @param {Array} updatedEdge - The array of edges to filter.
         * @returns {Array} An array of unique edges with no duplicates based on their 'id' property.
         */
        return updatedEdge.filter(
          (edge, index, edges) =>
            edges.indexOf(edges.filter((e) => e.id === edge.id)[0]) === index
        );
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

  const onNodesDelete = useCallback(
    (nodeLists: Node[]) => {
      /**
       * Extracts the IDs of nodes from an array of node lists.
       * @param {Array} nodeLists - An array of node lists.
       * @returns {Array} An array of IDs of the nodes extracted from the node lists.
       */
      const deletedNodeIDs = nodeLists.map((node) => node.id);

      /**
       * Updates the node configurations by filtering out the configurations of deleted nodes.
       * @param {NodeConfiguration[]} nodeConfigurations - The array of node configurations to update.
       * @returns None
       */
      setNodeConfigurations((nodeConfigurations) =>
        nodeConfigurations.filter(
          (nodeConfiguration) =>
            !deletedNodeIDs.includes(nodeConfiguration.nodeID)
        )
      );
    },
    [nodes, nodeConfigurations]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      /**
       * Parses the JSON data from the event data transfer and extracts the moduleID, type, label,
       * configured, and nodeDescription properties.
       * @param {string} event.dataTransfer.getData("application/ecoflow/nodes") - The JSON data to parse.
       * @returns An object containing moduleID, type, label, configured, and nodeDescription properties.
       */
      const { moduleID, type, label, configured, nodeDescription } = JSON.parse(
        event.dataTransfer.getData("application/ecoflow/nodes")
      );

      /**
       * Checks if the type is undefined or falsy, and returns early if it is.
       * @param {any} type - The type to check for undefined or falsy value.
       * @returns None
       */
      if (typeof type === "undefined" || !type) return;

      /**
       * Converts screen coordinates to flow coordinates using the reactFlowInstance.
       * @param {object} event - The event object containing clientX and clientY properties.
       * @returns The position object with x and y coordinates in flow space.
       */
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      /**
       * Generates a unique node ID.
       * @returns {string} A unique node ID.
       */
      const nodeID = generateNodeID();

      /**
       * Creates a new node with the specified properties.
       * @param {string} nodeID - The ID of the node.
       * @param {string} type - The type of the node.
       * @param {Position} position - The position of the node.
       * @param {string} moduleID - The ID of the module.
       * @param {string} label - The label of the node.
       * @param {boolean} configured - Indicates if the node is configured.
       * @param {string} nodeDescription - The description of the node.
       * @param {NodeAppearanceConfigurations} defaultNodeAppearance - The default appearance of the node.
       * @returns A new node with the specified properties.
       */
      const newNode: Node<FlowsNodeDataTypes & { nodeDescription?: string }> = {
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
          nodeDescription: nodeDescription,
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

      /**
       * Concatenates a new node to the existing list of nodes using the setNodes function.
       * @param {Array} nds - The current list of nodes.
       * @param {any} newNode - The new node to be added to the list.
       * @returns None
       */
      setNodes((nds) => nds.concat(newNode));

      /**
       * Updates the node configurations by adding a new configuration object for a specific node ID.
       * @param {Function} setNodeConfigurations - The function to update the node configurations.
       * @param {string} nodeID - The ID of the node to add configuration for.
       * @returns None
       */
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
    setNodes(
      flowHandlers.flowEditorValue[activeFlow].definitions.map((definition) => {
        if (isUndefined(definition.data.openDrawer))
          definition.data.openDrawer = (
            label: string,
            configured: boolean,
            disabled: boolean,
            description: string,
            appearance: NodeAppearanceConfigurations
          ) =>
            openConfigurationDrawer(
              definition.id,
              definition.data.moduleID,
              label,
              configured,
              disabled,
              description,
              appearance
            );

        return definition;
      })
    );
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

  useEffect(() => {
    if (!isUndefined(flowHandlers.flowEditorValue[activeFlow]?.definitions))
      setNodes((nodes) => {
        const nodeIDs = flowHandlers.flowEditorValue[
          activeFlow
        ].definitions.map((definition) => definition.id);

        nodes.map((node) => {
          if (nodeIDs.includes(node.id)) {
            const updatedNode = flowHandlers.flowEditorValue[
              activeFlow
            ].definitions.find((n) => n.id === node.id)!;
            node.data = updatedNode.data;
          }

          return node;
        });

        return [...nodes];
      });
  }, [flowHandlers.flowEditorValue[activeFlow]?.definitions]);

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
            onNodesDelete={onNodesDelete}
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
