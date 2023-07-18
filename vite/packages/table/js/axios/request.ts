import axios from "axios";
import {getConfig} from "./serverApi";

export async function get(url, params={}) {
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


export async function post(url, data) {
  const result = await axios.post(url, {
      ...data
    },
    await getConfig())
  console.log('请求响应=',result)
  if (result.data.code === 1000) {
    return result.data.data
  } else {
    return null
  }
}
