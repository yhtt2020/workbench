import axios from "axios"
/**
 * 随机获取四个数据
 * @param  data   数组
 * @param  count  数量
 * **/
export function randomData(data: any,count: any) {
   const result = []
   while (result.length < count){
    const randomIndex = Math.floor(Math.random() * data.length)
    const randomElement = data[randomIndex]
    if (!result.includes(randomElement)) {
      result.push(randomElement);
    }
   }
   return result;
}

/***
 * 处理请求超时问题
 * @param url
*/
export const requestData = (url: any, options = {}) => {
  const defaultOptions = {
    retries: 5, // 默认重试次数为3次
    retryInterval: 5000 // 默认重试间隔为5秒
  };
  const requestOptions = Object.assign({}, defaultOptions, options);

  return axios({
    url,
    method: 'get',
    timeout: 5000 // 设置超时时间为5秒钟
  })
  .catch(error => {
    if(requestOptions.retries > 0) {
      console.log(`${url} 请求超时，${requestOptions.retries} 秒后将会进行第 ${requestOptions.retries} 次重试`);
      return new Promise(resolve => setTimeout(() => resolve(requestData(url, { ...requestOptions, retries: requestOptions.retries - 1 })), requestOptions.retryInterval));
    }
    return Promise.reject(error);
  });
};