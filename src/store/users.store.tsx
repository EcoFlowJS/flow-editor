import { atom } from "jotai";
import { UserPermissions } from "@ecoflow/types";
import defaultPermissions from "../defaults/defaultPermissions.default";

const userPermissions = atom<UserPermissions>(defaultPermissions);
const userPermissionFetched = atom(false);

export { userPermissions, userPermissionFetched };
