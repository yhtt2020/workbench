import axios from "axios";
import {Server} from '../../../../consts'
const service = axios.create({
  baseURL: Server.baseUrl, //请求的地址
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
