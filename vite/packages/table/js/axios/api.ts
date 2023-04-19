import axios from "axios";
/***
 * 处理请求超时问题
 * @param url
 */
export const sendRequest = (url, params, retries = 0) => {
  const max_count = 5;
  return axios
    .get(url, { params })
    .then((response) => {
      if (response.status === 200) {
        retries = 0;
        return response;
      }
    })
    .catch((error) => {
      if (retries < max_count) {
        retries++;
        console.log(`请求失败,重试第${retries}次...`);
        return new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
          sendRequest(url, params, retries);
        });
      } else {
        console.error(error);
        throw new Error("已经达到最大次数");
      }
    });
};

/**
 * 随机获取四个数据
 * @param  data   数组
 * @param  count  数量
 * **/
export function randomData(data: any, count: any) {
  const result = [];
  if (data && data.length > 0) {
    while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomElement = data[randomIndex];
      if (!result.includes(randomElement)) {
        result.push(randomElement);
      }
    }
  } else {
    return;
  }
  return result;
}
