import { ApiResponse } from "@eco-flow/types";
import axios from "../../utils/axios/axios";
import { AxiosError } from "axios";

const fetchUserPermissions = async (
  mode: "RoleList" | "Permissions" | null = null
): Promise<ApiResponse> => {
  const res = await axios.get(
    `users/permissions${mode !== null ? `/${mode}` : ""}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res instanceof AxiosError) throw res.response?.data as ApiResponse;
  else return res.data as ApiResponse;
};

export default fetchUserPermissions;
