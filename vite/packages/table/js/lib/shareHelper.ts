import {apiGet, apiPost} from "../axios/request"
//注意，凡是带force的接口，首次请求都有可能返回失败，失败原因可能是被占用，需要二次请求，并携带force=1才能成功

const shareHelper = {
  create(code,alias,password,expireTime,type,data) {
    return apiPost('/app/share/create', {
      code,
      alias,
      password,
      expireTime,
      type,
      data
    })
  },
  get(code,password){
    return  apiPost('/app/share/get', {
      code,
      password,
    })
  },
  my(page=1,limit=10){
    return apiPost('/app/share/my',{
      page,limit
    })
  },
  remove(code){
    return apiPost('/app/share/remove',{
      code
    })
  }

}
export default shareHelper
