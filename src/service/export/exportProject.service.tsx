import { AxiosError } from "axios";
import axios from "../../utils/axios/axios";
import { ValueType } from "rsuite/esm/RadioTile/RadioTile";

const exportProject = async (exportType: ValueType): Promise<Blob> => {
  const res = await axios.post(
    `exports`,
    { exportType },
    {
      headers: { "Content-Type": "application/json" },
      responseType: "blob",
    }
  );

  if (res instanceof AxiosError) throw res.response?.data;
  else return res.data;
};

export default exportProject;
