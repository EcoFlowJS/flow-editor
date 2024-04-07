import { FlowsConfigurations } from "@ecoflow/types";
import { atom } from "jotai";

const flowEditor = atom<FlowsConfigurations>({});

export { flowEditor };
