import {
  FlowEditorSettingsConfigurations,
  FlowsDescription,
  FlowsConfigurationsDrawer,
  FlowsEdgeDataTypes,
  FlowsNodeDataTypes,
  NodeConfiguration,
} from "@ecoflow/types";
import { atom } from "jotai";
import defaultFlowEditorSettings from "../defaults/defaultFlowEditorSettings.default";
import { Edge, Node } from "reactflow";

const isLoadingFlowEditor = atom({ flow: true, flowSettings: true });

const flowEditor = atom<FlowsDescription>({});
const flowEditorConfigurationsDrawer = atom<FlowsConfigurationsDrawer>({
  show: false,
});
const debugConsoleDrawer = atom<boolean>(false);
const flowEditorSettings = atom<FlowEditorSettingsConfigurations>(
  defaultFlowEditorSettings
);

const currentFlow = atom<string>("");
const currentFlowNodes = atom<Node<FlowsNodeDataTypes, string | undefined>[]>(
  []
);
const currentFlowEdges = atom<Edge<FlowsEdgeDataTypes>[]>([]);
const currentFlowConfigurations = atom<NodeConfiguration[]>([]);

export {
  isLoadingFlowEditor,
  flowEditor,
  flowEditorConfigurationsDrawer,
  debugConsoleDrawer,
  flowEditorSettings,
  currentFlow,
  currentFlowNodes,
  currentFlowEdges,
  currentFlowConfigurations,
};
