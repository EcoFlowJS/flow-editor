import axios from "axios";

const instance = axios.create({ withCredentials: true });

instance.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? window.location.origin + "/systemApi/"
    : "http://localhost:4000/systemApi/";
instance.defaults.headers.common["Content-Type"] = "application/json";
instance.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

instance.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    switch (error.code) {
      case "ERR_NETWORK":
        throw { error: true, code: 504, payload: error };
    }

    if (error.response.status === 401) {
      const response = await instance.patch(
        "auth/users/refreshToken",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data["payload"]}`;

        return instance(error.config);
      }
    }
    return error;
  }
);

export default instance;
