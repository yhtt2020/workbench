import axios from "axios";
export const regionRange= [
  {
    id: 'cn',
    name: '国区',
  },
  {
    id: 'ar',
    name: '阿根廷',
  }, {
    id: 'us',
    name: '美国'
  },
  {
    id: 'ca',
    name: '加拿大'
  },
  {
    id: 'gb',
    name: '英国'
  }, {
    id: 'fr',
    name: '法国'
  }, {
    id: 'de',
    name: '德国'
  }, {
    id: 'it',
    name: '意大利'
  }, {
    id: 'jp',
    name: '日本',
  }, {
    id: 'br',
    name: '巴西',
  }, {
    id: 'in',
    name: '印度',
  }, {
    id: 'ru',
    name: '俄罗斯',
  }, {
    id: 'au',
    name: '澳大利亚',
  },
  {
    id: 'hk',
    name: '香港',
  }

]
/***
 * 处理请求超时问题
 * @param url
 * @param params
 */
export const sendRequest = async (url, params) => {
  return await axios.get(url, {params})
  // return axios
  //   .get(url, {params})
  //   .then((response) => {
  //     if (response.status === 200) {
  //       retries = 0;
  //       return response;
  //     }
  //   })
  //   .catch((error) => {
  //     if (retries < max_count) {
  //       retries++;
  //       console.log(`请求失败,重试第${retries}次...`);
  //       return new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
  //         sendRequest(url, params, retries).then(res => {
  //           resolve(res)
  //         });
  //       });
  //     } else {
  //       console.error(error);
  //       throw new Error("已经达到最大次数");
  //     }
  //   });
};

// 判断时间是否大于12h
export function compareTime(date) {
  const nowDate = new Date()  // 获取当前时间
  const expiresDate = new Date(date)  // 过期时间

  // 计算时间差  当前时间  -  过期时间
  const timeDiff = nowDate.getTime() - expiresDate.getTime()

  // 时间差转换成小时来比较是否大于12h
  const hoursDiff = timeDiff / (1000 * 60 * 60)

  if (hoursDiff > 12) {
    return true
  } else {
    return false
  }
}

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
export function currencyFormat(value: number, currencyCode: any) {
  const priceValue = (value / 100).toFixed(2)
  const formatter = new Intl.NumberFormat('us', {
    style: 'currency',
    currency: currencyCode
  });
  return formatter.format(priceValue);
}

// 判断本周的方法
export function startOfWeek() {
  const today = new Date();
  const firstDayOfWeek = today.getDate() - today.getDay() + 1;
  return new Date(today.setDate(firstDayOfWeek));
}

// 判断下周的方法
export function startOfNextWeek() {
  const today = new Date();
  const firstDayOfWeek = today.getDate() - today.getDay() + 1;
  return new Date(today.setDate(firstDayOfWeek + 7));
}
