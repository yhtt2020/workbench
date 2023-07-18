import axios from "axios";
const service = axios.create({
  baseURL: "http://127.0.0.1:3000",
  timeout: 5000,
});

service.interceptors.response.use((response) => {
  const { data } = response.data;
  return data;
});
export default service;
