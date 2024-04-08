import {
  FlowEditorSettingsConfigurations,
  FlowsConfigurations,
  FlowsConfigurationsDrawer,
} from "@ecoflow/types";
import { atom } from "jotai";

const flowEditor = atom<FlowsConfigurations>({});
const flowEditorConfigurationsDrawer = atom<FlowsConfigurationsDrawer>({
  show: false,
});
const debugConsoleDrawer = atom<boolean>(false);
const flowEditorSettings = atom<FlowEditorSettingsConfigurations>({
  disabledkeyboard: false,
  controls: false,
  miniMap: false,
  panMiniMap: false,
  scrollPan: false,
});

export {
  flowEditor,
  flowEditorConfigurationsDrawer,
  debugConsoleDrawer,
  flowEditorSettings,
};
