import axios from './baseURL'
import { sUrl } from '../../packages/table/consts'
const url = {
  homeRecommend:'/app/good/getGoodRecommend',//首页推挤接口
  select:'/app/good/app/selectApp',
  downloadCount:'/app/good/app/downloadCount',//安装数量
  findAppByNanoid:'/app/good/app/findAppByNanoid',//查找指定应用
  editApp:'app/good/app/editApp/',
  onShelvesChangeUserApp:'app/good/app/onShelvesChangeUserApp',
  findAppByUser:'/app/good/app/findAppByUser',
  verifyPackageName:'/app/good/verifyPackageName',
  addApp:'/app/good/app/addApp',
  findAppByAppNameNew:'/app/good/app/findAppByAppNameNew',
  hasSupported:'/app/good/app/hasSupported',
  support:'/app/good/app/support',
  updateApp:'/app/good/app/updateApp/',
  cosUpload:'/app/cosUpload',
  forumIndex:'/app/forum/forumIndex',
}

const getConfig = async () => {
  let token;
    const res = await window.tsbApi.user.get()
    token = res.data.token

  return {
    headers: {
      'Authorization': token
    }
  }
}
const result = (res,callback)=>{
  if(res.data.code == 1000){
    callback(true,res)
  }else{
    console.error(res)
    callback(false)
  }
}

const api = {
  async getCosUpload(data,callback) {  // 非工作台图片上传请求方法
    let res = await axios.post(url.cosUpload,
      data,
      await getConfig()
    )
    result(res,callback)
  },

  async postCosUpload(data,callback){  // 工作台图片上传请求方法
    let res = await axios.post(sUrl(url.cosUpload),
      data,
      await getConfig()
    )
    result(res,callback)
  }
}
export default api
