import axios from "axios";
// import {Server} from "../../../../../../../../src/util/"
// import {Server} from "../../../../../../../../src/util/"
// C:\Users\16110\Desktop\demo1 (2)\browser\vite\packages\table\consts.ts
import { Server } from "../../../../../../table/consts";
console.log("object :>> ", Server);
const service = axios.create({
  baseURL: "https://wad.apps.vip/api", //请求的地址
  timeout: 5000, //访问超时的时间
});

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default service;