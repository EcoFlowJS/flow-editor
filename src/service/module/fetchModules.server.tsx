import { ApiResponse } from "@ecoflow/types";
import axios from "../../utils/axios/axios";
import { AxiosError } from "axios";

const fetchModules = async (moduleID?: string): Promise<ApiResponse> => {
  const res = await axios.get(`module${moduleID ? `/id/${moduleID}` : ""}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (res instanceof AxiosError) throw res.response?.data as ApiResponse;
  else return res.data as ApiResponse;
};

export default fetchModules;
