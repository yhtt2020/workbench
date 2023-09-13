import {defineStore} from 'pinia'
import dbStorage from "../../store/dbStorage";
import {sUrl} from "../../consts";
import {post} from "../../js/axios/request";
import {localCache} from '../../js/axios/serverCache'
const community=sUrl('/app/com/forum/getDetail')
const cate=sUrl('/app/com/forum/getThreadClasses')
const threadList=sUrl('/app/com/forum/getThreadList')
const detail=sUrl('/app/com/thread/getDetail')
const replyList=sUrl('/app/com/thread/getReplyList')
const upload=sUrl('/app/upload')
export const useCommunityStore = defineStore('community',{
    state:()=>({
        communityInfo:[],
        communityCate:[],
        communityPost:[],
        communityPostDetail:[],
        communityReply:[],
    }),
    actions:{
        // 根据板块id来获取板块信息
        async getCommunityInfo(id){
            if(localCache.get(`communityInfo_${id}`)){
                this.communityInfo=localCache.get(`communityInfo_${id}`)
            }
            let res=await post(community,{
                fid:id
            })
            // console.log(res);
            this.communityInfo=res.data
            localCache.set(`communityInfo_${id}`,this.communityInfo,60*60*24)

        },
        // 获取板块下的所有分类
        async getCommunityCate(id){
            if(localCache.get(`communityCate_${id}`)){
                this.communityCate=localCache.get(`communityCate_${id}`)
            }
            // if(localCache.get)
            let res=await post(cate,{
                fid:id
            })
            // console.log(res);
            if(res.code===200){
                this.communityCate=res.data
                localCache.set(`communityCate_${id}`,this.communityCate,60*60*24)
            }


        },
        // 获取查询板块下的所有帖子
        async getCommunityPost(id,type){
            if(localCache.get(`communityPost_${id}-${type}`)){
                this.communityPost=localCache.get(`communityPost_${id}-${type}`)
            }
            let res=await post(threadList,{
                fid:id,
                page:1,
                row:10,
                type:type,
                classId:67
            })
            if(res.code===200){
            //   console.log(res,'返回数据')
                this.communityPost=res.data
                // console.log(this.communityPost);
                localCache.set(`communityPost_${id}-${type}`,this.communityPost,60*60*24)
            }

        },
        // 查看帖子详情
        async getCommunityPostDetail(id){
            if(localCache.get(`communityPostDetail_${id}`)){
                this.communityPostDetail=localCache.get(`communityPostDetail_${id}`)
            }
            let res=await post(detail,{
                tid:id
            })
            // console.log('datail', res);
            if(res.code===200){
                this.communityPostDetail=res.data
                // console.log('chakan',this.communityPostDetail);
                localCache.set(`communityPostDetail_${id}`,this.communityPostDetail,60*60*24)
            }
        },
        //查看帖子回复
        async getCommunityPostReply(id){
            if(localCache.get(`communityReply_${id}`)){
                this.communityReply=localCache.get(`communityReply_${id}`)
            }
            let res=await post(replyList,{
                tid:id,
                page:1,
                row:10,
                type:1
            })
            // console.log('reply',res);
            if(res.code===200){
                this.communityReply=res.data
                localCache.set(`communityReply_${id}`,this.communityReply,60*60*24)
            }
        },
        // 图片上传
        async uploadImage(file){
            let res=await post(upload,{
                file:file
            })
        }



    },
    persist: {
        enabled: true,
        strategies: [
          {
            storage: dbStorage,
            paths: ['communityInfo','communityCate','communityPost','communityPostDetail','communityReply'],
          }
        ]
      }

})

