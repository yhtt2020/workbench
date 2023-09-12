import {defineStore} from 'pinia'
import dbStorage from "../../store/dbStorage";
import {sUrl} from "../../consts";
import {post} from "../../js/axios/request";
import {localCache} from '../../js/axios/serverCache'
const community=sUrl('/app/com/forum/getDetail')
const cate=sUrl('/app/com/forum/getThreadClasses')
export const useCommunityStore = defineStore('community',{
    state:()=>({
        communityInfo:[]
    }),
    actions:{
        // 根据板块id来获取板块信息
        async getCommunityInfo(id){
            if(localCache.get(id)){
                this.communityInfo=localCache.get(id)
            }
            let res=await post(community,{
                fid:id
            })
            console.log(res);
            
        },
        // 获取板块下的所有分类
        async getCommunityCate(id){
            // if(localCache.get)
            let res=await post(cate,{
                fid:id
            })
            console.log(res);
            
        }

    },
    persist: {
        enabled: true,
        strategies: [
          {
            storage: dbStorage,
            paths: ['communityInfo'],
          }
        ]
      }
    
})

