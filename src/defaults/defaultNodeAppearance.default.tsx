import { NodeAppearanceConfigurations } from "@ecoflow/types";

const defaultNodeAppearance: Required<NodeAppearanceConfigurations> = {
  label: true,
  icon: null,
  portLabel: {
    input: "",
    output: "",
  },
};

export default defaultNodeAppearance;
