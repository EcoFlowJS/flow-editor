import {
  FlowEditorSettingsConfigurations,
  FlowsConfigurations,
  FlowsConfigurationsDrawer,
  FlowsEdgeDataTypes,
  FlowsNodeDataTypes,
  NodeConfiguration,
} from "@ecoflow/types";
import { atom } from "jotai";
import defaultFlowEditorSettings from "../defaults/defaultFlowEditorSettings.default";
import { Edge, Node } from "reactflow";

const flowEditor = atom<FlowsConfigurations>({});
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
  flowEditor,
  flowEditorConfigurationsDrawer,
  debugConsoleDrawer,
  flowEditorSettings,
  currentFlow,
  currentFlowNodes,
  currentFlowEdges,
  currentFlowConfigurations,
};
