import { ApiResponse } from "@ecoflow/types";
import axios from "../../utils/axios/axios";

const userSignoutService = async (): Promise<ApiResponse> => {
  const res: ApiResponse = (await axios.delete("/auth/users/logout")).data;
  if (res.success) axios.defaults.headers.common["Authorization"] = "";
  return res;
};

export default userSignoutService;
