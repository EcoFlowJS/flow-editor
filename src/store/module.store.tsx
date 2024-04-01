import { Modules } from "@ecoflow/types";
import { atom } from "jotai";

const ecoModules = atom<Modules>([]);

export { ecoModules };
