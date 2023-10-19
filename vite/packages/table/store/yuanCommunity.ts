import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {post} from "../js/axios/request";
import {localCache} from '../js/axios/serverCache'
const myForum = sUrl('/app/com/forum/my')
const threadList=sUrl('/app/com/forum/getThreadList')

export const yuanCommunityStore = defineStore("yuanCommunity", {
    state: () => ({
        myForumList: [],
        communityPost: [],
    }),
    actions: {
        // 获取我的圈子
        async getMyForumList() {
            const cacheData=localCache.get('myForumList')
            if(cacheData){
                this.myForumList=cacheData
            }
            const res=await post(myForum)
            if(res.code===200){
                this.myForumList=res.data
            }
            localCache.set('myForumList',this.myForumList,60*60*12)
            // console.log(res.data,'myForum');
            
        },
        // 获取查询板块下的所有帖子
        async getCommunityPost(id,page=1,type='all',order=''){
            let communityPostCache=localCache.get(`communityPost_${id}-${page}-${type}`)
            if(communityPostCache){
                this.communityPost=communityPostCache
            }
            let res=await post(threadList,{
                fid:id,
                page:page,
                row:10,
                type:type,
                classId:67,
                order:order
            })
            if(res.code===200){
                // console.log(res.data,'返回数据')
                this.communityPost=res.data
                // console.log(this.communityPost,'this.communityPost');
                localCache.set(`communityPost_${id}-${page}-${type}`,this.communityPost,60*60*12)
            }

        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: dbStorage,
                paths: ['myForumList'],
            }
        ]
    }
})