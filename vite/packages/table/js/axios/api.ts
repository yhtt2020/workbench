import axios from "axios";
/***
 * 处理请求超时问题
 * @param url
 * @param retries
 */
export const sendRequest = (url: string, params: any,retries=0) => {
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


/***
 * 根据不同国家将货币进行转换
*/
export function currencyFormat(value: number, currencyCode: any){
  const priceValue = (value / 100).toFixed(2)
  const formatter = new Intl.NumberFormat('us', {
    style: 'currency',
    currency: currencyCode
  });
  return formatter.format(priceValue);
}
