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
  return await  serverCache.get(url,{cache:true,ttl:6*60*60,...cacheOptions},{params}) 
};
export const cacheRequest = async (url, params,cacheOptions={}) => {
  return await  serverCache.get(url,{cache:true,ttl:60*60*12,...cacheOptions},{params})

};
export const quickRequest = async (url, params,cacheOptions={}) => {
  return await  serverCache.get(url,{cache:true,ttl:60*10,...cacheOptions},{params})
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

