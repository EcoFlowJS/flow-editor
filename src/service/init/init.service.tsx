import axios from "../../utils/axios/axios";
import { ApiResponse } from "@eco-flow/types";

const promise = async (): Promise<any> => {
  let result = {
    isAuth: false,
    isNew: false,
    isLoggedIn: false,
    userID: undefined,
  };
  const res = (await axios.get("init/status")).data;
  result.isAuth = res.isAuth;

  if (!res.isAuth) {
    if (res.hasOwnProperty("getAccessToken"))
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.getAccessToken}`;
    result.isLoggedIn = true;
    result.userID = res.userID;
  }

  if (res.isAuth && res.isNewClient) result.isNew = true;

  if (res.isAuth && !res.isNewClient) {
    const ress: ApiResponse = (await axios.get("auth/users/isAuthenticated"))
      .data;

    if (ress && ress.success) {
      result.isLoggedIn = true;
      result.userID = ress.payload._id;
    }
  }

  return await new Promise<any>((resolve) =>
    setTimeout(() => resolve(result), 200)
  );
};

export const initService = async () => await promise();
