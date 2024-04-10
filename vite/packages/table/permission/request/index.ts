import XyRequest from "./request";
import cache from "../../components/card/hooks/cache";
import { Server } from "../../consts";
const request = new XyRequest({
  baseURL: Server.baseUrl,
  timeout: 1000,
  headers: {
    "Content-type": "application/json;charset=UTF-8",
  },
  interceptors: {
    requestInterceptor: (config: any) => {
      config.headers.Authorization = cache.get("ttUserToken");
      return config;
    },
    requestInterceptorCatch: (err: any) => {
      return err;
    },
    responseInterceptor: (res: any) => {
      return res.data;
    },
    responseInterceptorCatch: (err: any) => {
      return err;
    },
  },
});

export default request;
