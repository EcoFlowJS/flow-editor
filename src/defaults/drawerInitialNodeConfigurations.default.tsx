import { FlowsConfigurationsDrawer } from "@ecoflow/types";

const drawerInitialNodeConfigurations: Required<
  Pick<
    FlowsConfigurationsDrawer,
    | "label"
    | "configured"
    | "disabled"
    | "description"
    | "appearance"
    | "nodeConfiguration"
  >
> = {
  label: "",
  configured: false,
  disabled: false,
  description: "",
  appearance: {},
  nodeConfiguration: {
    nodeID: "",
    configs: {},
  },
};

export default drawerInitialNodeConfigurations;
