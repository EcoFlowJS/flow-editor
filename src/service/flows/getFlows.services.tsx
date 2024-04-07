import { ApiResponse } from "@ecoflow/types";
import axios from "../../utils/axios/axios";
import { AxiosError } from "axios";

const getFlows = async (flowName?: string): Promise<ApiResponse> => {
  const res = await axios.get(`flows${flowName ? `/${flowName}` : ""}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (res instanceof AxiosError) throw res.response?.data as ApiResponse;
  else return res.data as ApiResponse;
};

export default getFlows;
