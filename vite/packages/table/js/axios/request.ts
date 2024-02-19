import axios from "axios";
import {getConfig} from "./serverApi";
import {sUrl} from "../../consts";

export async function get(url, params = {}) {
  const result = await axios.get(url, {
    params: params,
    ...await getConfig()
  })

  if (result.data.code === 1000) {
    return result.data.data
  } else {
    console.error(result)
    return null
  }
}

/**
 *
 * @param urlRoute 路由，不需要拼接url
 * @param params
 */
export async function apiGet(urlRoute,params={}){
  return get(sUrl(urlRoute),params)
}
export async function apiPost(urlRoute, data={}, options = {crud: false}){
  return post(sUrl(urlRoute),data,options)
}
// mock测试环境下的请求方式
export async function postMock(url, data, options = {crud: false}) {
  url=url.replace('https://wad.apps.vip/api','https://mock.apifox.cn/m1/1677090-0-default')
  return post(url, data, options)
}

export async function post(url, data={}, options = {crud: false}) {
  let conf = await getConfig()
  if (options.crud) {
    conf.headers['Content-Type'] = 'application/json'
  }
  let result
  if(options.crud){
     result = await axios.post(url, JSON.stringify(data), conf
    )
  }else{
     result = await axios.post(url, {
        ...data
      }, conf
    )
  }
  if (result.data.code === 1000 || result.data.code == 200) {
    return result.data.data
  } else {
    console.error('接口返回意外错误',result)
    return null
  }
}


//提取壁纸接口请求
export async function paperGet(url:any, params = {}) {
  const getUrl = `https://api.nguaduot.cn${url}`;
  const result = await axios.get(getUrl, {
    params: params,
    headers:{'Timeline-Client':'thisky'},
  })
  return result;
}

// 获取必应数据
export async function bingGet(url:any){
  const result = await axios.get(url)
  return result;
}
