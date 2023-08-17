import XyRequest from "./request/request"
const request = new XyRequest({
  baseURL: "https://api.closeai-proxy.xyz/v1",
  timeout: 10000,
  headers: {
    "Content-type": "application/json",
    Authorization: "Bearer sk-pHFEys8cIfIKq40iu4NFaEmRlyVwTON7mn8fhRs931Z7MpYi"
  },
  interceptors: {
    requestInterceptor: (config: any) => {
      return config
    },
    requestInterceptorCatch: (err) => {
      return err
    },
    responseInterceptor: (res) => {
      return res.data
    },
    responseInterceptorCatch: (err) => {
      return err
    }
  }
})

export default request
