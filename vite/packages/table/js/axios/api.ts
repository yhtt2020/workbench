import axios from "axios";
import {serverCache} from "./serverCache";
export const regionRange= [
  {
    id: 'cn',
    name: '国区',
    locale:'zh-CN'
  },
  {
    id:'tr',
    name:'土耳其',
    locale:'tr-TR'
  },

  {
    id: 'ar',
    name: '阿根廷',
    locale:'ar-AR'
  },
  {
    id: 'hk',
    name: '香港',
    locale:'zh-HK'
  }, {
    id: 'us',
    name: '美国',
    locale:'us-US'
  },
  {
    id: 'ca',
    name: '加拿大',
    locale:'ca-CA'
  },
  {
    id: 'gb',
    name: '英国',
    locale:'gb-GB'
  }, {
    id: 'fr',
    name: '法国',
    locale:'fr-FR'
  }, {
    id: 'de',
    name: '德国',
    locale:'de-DE'
  }, {
    id: 'it',
    name: '意大利',
    locale:'it-IT'
  }, {
    id: 'jp',
    name: '日本',
    locale:'jp-JP'
  }, {
    id: 'br',
    name: '巴西',
    locale:'br-BR'
  }, {
    id: 'in',
    name: '印度',
    locale:'in-IN'
  }, {
    id: 'ru',
    name: '俄罗斯',
    locale:'ru-RU'
  }, {
    id: 'au',
    name: '澳大利亚',
    locale:'au-AU'
  },
  {
    id:'kr',
    name:'韩国',
    locale:'kr-KR'
  }

]
/***
 * 处理请求超时问题
 * @param url
 * @param params
 * @param cacheOptions
 */
export const sendRequest = async (url, params,cacheOptions={}) => {
  return await  serverCache.get(url,{cache:true,ttl:60,...cacheOptions},{params}) // axios.get(url, {params})
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
export function startOfWeek(startDate,endDate) {
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
  // 本周的第一天是否大于startDate 和 最后一天是否大于endDate的情况
  if(firstDayOfWeek.getTime() > startDate.getTime() && lastDayOfWeek.getTime() > endDate.getTime()){
   return true
  }
  // 本周的第一天是否小于startDate 最后一天是否小于endDate的情况
  else if(firstDayOfWeek.getTime() < startDate.getTime() && lastDayOfWeek.getTime() < endDate.getTime()){
   return true
  }
  // 本周的第一天是否大于startDate 最后一天是否小于endDate的情况
  else if(firstDayOfWeek.getTime() > startDate.getTime() && lastDayOfWeek.getTime() < endDate.getTime() ){
    return true
  }
}

// 判断下周的方法
export function startOfNextWeek(startDate,endDate) {
  const today = new Date();
  const nextWeekFirstDay = new Date(today.setDate(today.getDate() - today.getDay() + 7));
  // 在下周第一天的基础上加7天来获取下周最后一天
  const nextWeekLastDay = new Date(today.setDate(today.getDate() - today.getDay() + 7) + 7);
  
  // 下一周的第一天是否大于startDate 和 最后一天是否大于endDate的情况
  if(nextWeekFirstDay.getTime() > startDate.getTime() && nextWeekLastDay.getTime() > endDate.getTime()){
    return true
  }
  // 下一周的第一天是否小于startDate 最后一天是否小于endDate的情况
  else if(nextWeekFirstDay.getTime() < startDate.getTime() && nextWeekLastDay.getTime() < endDate.getTime()){
    return true
  }
  // 下一周的第一天是否大于startDate 最后一天是否小于endDate的情况
  else if(nextWeekFirstDay.getTime() > startDate.getTime() && nextWeekLastDay.getTime() < endDate.getTime() ){
    return true
  }
}

// 计算剩余多少天
export const remainderDay = (date: string | number | Date) => {
  // 假设要计算的日期为2023年6月1日
  let targetDate = new Date(date);
  // 获取当前日期
  let currentDate = new Date();
  // 计算剩余天数
  let remainingDays = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
  // 输出剩余天数
  return remainingDays
}
