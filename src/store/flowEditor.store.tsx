import {
  FlowEditorSettingsConfigurations,
  FlowsConfigurations,
  FlowsConfigurationsDrawer,
  FlowsDataTypes,
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

const currentFlowNodes = atom<Node<FlowsDataTypes, string | undefined>[]>([]);
const currentFlowEdges = atom<Edge<any>[]>([]);
const currentFlowConfigurations = atom<NodeConfiguration[]>([]);

export {
  flowEditor,
  flowEditorConfigurationsDrawer,
  debugConsoleDrawer,
  flowEditorSettings,
  currentFlowNodes,
  currentFlowEdges,
  currentFlowConfigurations,
};
