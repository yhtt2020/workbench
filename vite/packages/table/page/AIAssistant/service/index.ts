import XyRequest from "./request/request";

import { aiStore } from "../../../store/ai";

const request1 = () => {
  // const ai = aiStore();
  const request = new XyRequest({
    // https://api.closeai-asia.com/dashboard/billing/credit_grants
    baseURL: "https://api.openai-proxy.live",
    timeout: 10000,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer sk-S7CZainBDqk8IJJR2H21882YjJMbcOQreOjeVHjIBfkoDx80`,
    },
    interceptors: {
      requestInterceptor: (config: any) => {
        return config;
      },
      requestInterceptorCatch: (err) => {
        return err;
      },
      responseInterceptor: (res) => {
        return res.data;
      },
      responseInterceptorCatch: (err) => {
        return err;
      },
    },
  });
  return request;
};
export default request1();
// const request = new XyRequest({
//   // https://api.closeai-asia.com/dashboard/billing/credit_grants
//   baseURL: "https://api.closeai-proxy.xyz",
//   timeout: 10000,
//   headers: {
//     "Content-type": "application/json",
//     Authorization: `Bearer sk-S7CZainBDqk8IJJR2H21882YjJMbcOQreOjeVHjIBfkoDx80`,
//   },
//   interceptors: {
//     requestInterceptor: (config: any) => {
//       return config;
//     },
//     requestInterceptorCatch: (err) => {
//       return err;
//     },
//     responseInterceptor: (res) => {
//       return res.data;
//     },
//     responseInterceptorCatch: (err) => {
//       return err;
//     },
//   },
// });

// export default request;
