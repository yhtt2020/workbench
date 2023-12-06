import {defineStore} from "pinia";
import dbStorage from "../../../store/dbStorage";
import {sUrl} from "../../../consts";
import {post} from "../../../js/axios/request";

// @ts-ignore
export const forumStore = defineStore('forum',{
  state:()=>({
    forumList:[],
  }),

  actions:{
    // 获取版块数据
    getForumData(){
      post(sUrl('/app/com/forum/my'),{}).then((result:any)=>{
        // console.log('获取版块数据',result)
        if(result.code === 200){
          this.forumList = result?.data?.create
        }
      })
    }

  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['forumList']
      // state 中的字段名，按组打包储存
    }]
  }
})
