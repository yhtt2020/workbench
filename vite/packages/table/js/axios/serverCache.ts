import axios, {AxiosRequestConfig} from 'axios'
import {sUrl} from '../../consts'

declare interface CacheOptions {
  //是否启用缓存，默认启用
  cache: boolean,
  //缓存周期
  ttl: number,
  //启用本地缓存
  localCache?: boolean,
  //本地缓存键名
  localKey?: string,
  //本地缓存周期
  localTtl?: number,
}

declare interface AxiosParams {
  url: string,
  config: AxiosRequestConfig
}

const getUrl = sUrl('/app/cache/get')
const setUrl = sUrl('/app/cache/set')

/**
 * 本地缓存
 */
export const localCache = {
  /**
   * 取一个本地缓存
   * @param key
   */
  get(key) {
    let localCacheData = undefined
    let localCache = localStorage.getItem(key)
    if (localCache) {

      let cacheData = JSON.parse(localCache)
      console.log('存在本地缓存', cacheData)
      if (cacheData.expireTime) {
        //如果设置了本地缓存过期时间，则加入时间的判断
        if (Date.now() > cacheData.expireTime) {
          //本地缓存过期
          console.log('本地缓存已过期')
          localStorage.removeItem(key)
        } else {
          localCacheData = cacheData.data
        }
      } else {
        console.log('命中本地缓存')
        localCacheData = cacheData.data
      }
    }
    return localCacheData
  },
  /**
   *
   * @param key 缓存键名
   * @param data 数据
   * @param ttl 缓存过期时间
   */
  set(key, data, ttl) {
    let cacheData = {
      data: data,
      expireTime: 0
    }
    if (ttl>0) {
      cacheData.expireTime = Date.now() + ttl * 1000
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  }
}


export const serverCache = {
  /**
   * 通过服务器缓存代理请求，优先取服务器的数据，如果发现服务器没有数据，则再发起axios请求，得到数据后，再提交到服务器，作为最新的数据
   * @param url
   * @param cacheOptions
   * @param axiosConfig
   */
  async get(url, cacheOptions: CacheOptions, axiosConfig) {
    let key = ''
    try {
      if (cacheOptions.localCache) {
        //如果使用了本地缓存
        let localCacheData
        //如果设置了键名
        key = cacheOptions.localKey ? cacheOptions.localKey : 'cache_' + encodeURIComponent(url)
        localCacheData = localCache.get(key)
        if (localCacheData) {
          return localCacheData
        } else {
          console.log('不存在本地缓存')
        }
      }
      let serverCacheResponse = await axios.get(getUrl, {
        params: {
          key:url
        }
      })
      // 请求服务器的serverCache接口
      if (serverCacheResponse.data.code === 1000 && serverCacheResponse.data.data !== undefined) {
        console.log(serverCacheResponse.data)
        return serverCacheResponse.data.data
      }
    } catch (e) {
      console.warn('请求服务器端缓存失败，走普通接口请求')
    }
    // 如果没有请求到数据
    // 直接发起axios请求
    let axiosResponse = await axios.get(url, axiosConfig.config)
    if (axiosResponse.status === 200) {
      console.log(axiosResponse.status)
      // 如果请求到数据，post到serverCache的setCache api
      serverCache.set(url, axiosResponse).then()
      localCache.set(key, axiosResponse, cacheOptions.localTtl)
      return axiosResponse
    }
  },

  /**
   * 设置服务器端缓存
   * @param key
   * @param data
   * @param ttl
   */
  async set(key, data, ttl = 0) {
    return await axios.post(setUrl,  {key: key, data: data, ttl: ttl})
  }
}
