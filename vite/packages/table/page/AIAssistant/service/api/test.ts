import request from "..";
import axios from "axios";
console.log("request :>> ", request);



export const links = () => {
  const service = axios.create({
    // baseURL: "https://wad.apps.vip/api", //请求的地址
    baseURL: "https://api.shadowai.xyz", //请求的地址
    timeout: 5000, //访问超时的时间
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer sk-S7CZainBDqk8IJJR2H21882YjJMbcOQreOjeVHjIBfkoDx80`,
    },
  });
  return service.get("/api/v1/links");
};
