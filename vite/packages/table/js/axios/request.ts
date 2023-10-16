import axios from "axios";
import {getConfig} from "./serverApi";

export async function get(url, params = {}) {
  const result = await axios.get(url, {
    params: params,
    ...await getConfig()
  })

  if (result.data.code === 1000) {
    return result.data.data
  } else {
    return null
  }
}

// mock测试环境下的请求方式
export async function postMock(url, data, options = {crud: false}) {
  url=url.replace('https://wad.apps.vip/api','https://mock.apifox.cn/m1/1677090-0-default')
  return post(url, data, options)
}

export async function post(url, data, options = {crud: false}) {
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
