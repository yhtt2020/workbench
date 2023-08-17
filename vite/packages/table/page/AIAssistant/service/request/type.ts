import type { AxiosRequestConfig } from "axios"
// 自定义拦截器类型
export interface XyRequestInterceptors {
  requestInterceptor?: (config: AxiosRequestConfig) => any // 请求成功拦截
  requestInterceptorCatch?: (error: any) => any // 请求失败拦截
  responseInterceptor?: (response: any) => any // 响应成功拦截
  responseInterceptorCatch?: (error: any) => any // 响应失败拦截
}
// 扩展默认类型
export interface XyRequestConfig extends AxiosRequestConfig {
  interceptors?: XyRequestInterceptors
  showLoading?: boolean
}
export const DEAFULT_LADING = true // 默认是否开启加载动画
