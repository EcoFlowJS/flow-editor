import { AxiosError } from "axios";
import axios from "../../utils/axios/axios";
import { ApiResponse } from "@ecoflow/types";

const getDB_Connections = async () => {
  const res = await axios.get(`schema/connections`, {
    headers: { "Content-Type": "application/json" },
  });

  if (res instanceof AxiosError) throw res.response?.data as ApiResponse;
  else return res.data as ApiResponse;
};

export default getDB_Connections;
