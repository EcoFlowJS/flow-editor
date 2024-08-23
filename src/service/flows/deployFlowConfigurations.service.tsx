import { ApiResponse, FlowsDescription } from "@ecoflow/types";
import axios from "../../utils/axios/axios";
import { AxiosError } from "axios";

const deployFlowConfigurations = async (
  flowconfigurations: FlowsDescription,
  current: boolean = false
): Promise<ApiResponse> => {
  const res = await axios.post(
    `flows/deploy`,
    { flowconfigurations, current },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res instanceof AxiosError) throw res.response?.data as ApiResponse;
  else return res.data as ApiResponse;
};

export default deployFlowConfigurations;
