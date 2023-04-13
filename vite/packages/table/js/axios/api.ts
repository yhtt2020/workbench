import axios from "axios"
const axiosInstance = axios.create({
  baseURL: 'https://store.steampowered.com/api/',
  timeout: 5000,  // 设置超时时间为 5 秒钟
})

/**
 * 处理请求超时问题
 * @param url  路径
 * @param maxRetry  最大限制重试请求的次数
 * @param delay   请求时间内毫秒
 * @param retryCount  重试次数
 * **/
export const getRequestWithRetry = (url,maxRetry,delay) =>{
   return new Promise((resolve,reject)=>{
    const doRequest = (retryCount) =>{
      axiosInstance.get(url)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        if (retryCount === maxRetry || error.code !== 'ECONNABORTED') {
          reject(error);
        } else {
          setTimeout(() => {
            doRequest(retryCount + 1);
          }, delay * (retryCount + 1));
        }
      });
    }
    doRequest(0)
   })
}