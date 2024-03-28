import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const initStatusState = atom<{
  isAuth: boolean;
  isNew: boolean;
  isLoggedIn: boolean;
  userID?: string;
}>({
  isAuth: false,
  isNew: false,
  isLoggedIn: false,
});

export const isLoggedOut = atomWithStorage("isLoggedOut", false);
export const isLoggedIn = atomWithStorage("isLoggedIn", false);

export default initStatusState;
