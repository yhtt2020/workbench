import {get,post }from '../js/axios/request'
import {sUrl} from '../consts'
import {defineStore} from "pinia";


const api={
  getCategories:sUrl('/app/category/list'),
  addDesk:sUrl('/app/good/desk/add')
}


export const marketStore = defineStore('marketStore', {
  state:()=>({

  }),
  actions:{
    getCategories(goodType,subType){
      return post(api.getCategories,{
        goodType:goodType,
        subType:subType
      })
    },
    addDesk(desk){
      console.log(desk,'需要上传的内容')
      return post(api.addDesk,{
        ...desk
      },{crud:true})
    }
  }
})
