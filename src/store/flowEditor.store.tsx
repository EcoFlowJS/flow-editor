import { DeploymentConfigurations } from "@ecoflow/types";
import { atom } from "jotai";

const flowEditor = atom<DeploymentConfigurations>({});

export { flowEditor };
