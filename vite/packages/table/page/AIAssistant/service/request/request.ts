import axios from "axios"
import type { AxiosInstance } from "axios"
import type { XyRequestConfig, XyRequestInterceptors } from "./type"

class XyRequest {
  instance: AxiosInstance // axios实例
  interceptors?: XyRequestInterceptors // 单例拦截器

  constructor(config: XyRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config.interceptors
    this.alone()
    this.all()
  }
  // 单例拦截
  alone() {
    // 注册单例请求拦截
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    // 注册单例响应拦截
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
  }
  // 全局拦截
  all() {
    // 注册全局请求拦截
    this.instance.interceptors.request.use(
      (config: any) => {
        return config
      },
      (err) => {
        return err
      }
    )
    // 注册全局响应拦截
    this.instance.interceptors.response.use(
      (res: any) => {

        return res
      },
      (err) => {
        return err
      }
    )
  }

  // 网络请求
  request<T = any>(config: XyRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      // 单独请求拦截
      config = config.interceptors?.requestInterceptor
        ? config.interceptors.requestInterceptor(config)
        : config

      this.instance
        .request<T, any>(config)
        .then((res) => {
          // 单独响应拦截
          res = config.interceptors?.responseInterceptor
            ? config.interceptors.responseInterceptor(res)
            : res
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get<T = any>(config: XyRequestConfig): Promise<T> {
    return this.request({ ...config, method: "GET" })
  }

  post<T = any>(config: XyRequestConfig): Promise<T> {
    return this.request({ ...config, method: "POST" })
  }

  delete<T = any>(config: XyRequestConfig): Promise<T> {
    return this.request({ ...config, method: "DELETE" })
  }

  patch<T = any>(config: XyRequestConfig): Promise<T> {
    return this.request({ ...config, method: "PATCH" })
  }


}

export default XyRequest
