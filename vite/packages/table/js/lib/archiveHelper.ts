import {apiGet, apiPost} from "../axios/request"
//注意，凡是带force的接口，首次请求都有可能返回失败，失败原因可能是被占用，需要二次请求，并携带force=1才能成功

const archiveHelper = {
  saveToCommunity(communityNo, appNanoid, data, force=0, key) {
    return apiPost('/app/archive/save', {
      appNanoid,
      communityNo,
      force,
      key,
      data
    })
  },
  saveToPersonal(appNanoid, data, force=0, key) {
    return apiPost('/app/archive/save', {
      appNanoid,
      force,
      key,
      data
    })
  },

    // 从社区加载archive
  loadFromCommunity(communityNo, appNanoid,key){
    // 调用apiGet函数，传入路由/app/archive/load，以及communityNo, appNanoid,key三个参数
    return apiPost('/app/archive/load', {
      // 传入communityNo参数
      appNanoid,
      // 传入communityNo参数
      communityNo,
      // 传入key参数
      key
    })
  }, // 从个人加载应用程序ID和密钥
  loadFromPersonal(appNanoid, key){
    // 调用apiGet方法，传入路径'/app/archive/load'和参数对象{appNanoid, key}
    return apiPost('/app/archive/load', {
      appNanoid,
      key
    })
  }
}
export default archiveHelper
