import {
  FlowEditorSettingsConfigurations,
  FlowsConfigurations,
  FlowsConfigurationsDrawer,
} from "@ecoflow/types";
import { atom } from "jotai";
import defaultFlowEditorSettings from "../defaults/defaultFlowEditorSettings.default";

const flowEditor = atom<FlowsConfigurations>({});
const flowEditorConfigurationsDrawer = atom<FlowsConfigurationsDrawer>({
  show: false,
});
const debugConsoleDrawer = atom<boolean>(false);
const flowEditorSettings = atom<FlowEditorSettingsConfigurations>(
  defaultFlowEditorSettings
);

export {
  flowEditor,
  flowEditorConfigurationsDrawer,
  debugConsoleDrawer,
  flowEditorSettings,
};
