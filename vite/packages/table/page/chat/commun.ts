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
const doSupport=sUrl('/app/com/doSupport')
const collect=sUrl('/app/com/collect')
const cancelCollect=sUrl('/app/com/cancelCollect')
const threadReply=sUrl('/app/com/thread/reply')
const threadPost=sUrl('/app/com/thread/post')

declare interface IThread {
  /**
   * 1进入人工审核0系统自动审核
   */
  artificial: string;
  /**
   * 文章@关注用户的id
   */
  atAttentionUser: string;
  /**
   * at部门
   */
  atDepartment: string;
  /**
   * at用户uid
   */
  atUser: string;
  /**
   * 音频id
   */
  audioid: string;
  /**
   * 音频时间
   */
  audioTime: string;
  /**
   * 音频连接
   */
  audiourl: string;
  /**
   * 分类
   */
  classid: string;
  /**
   * 只是付费商品id
   */
  columnid: string;
  /**
   * 详情
   */
  content: string;
  /**
   * 是否开启内容付费1开启0不开启
   */
  contentPay: string;
  /**
   * 内容付费展示比例
   */
  contentRate: string;
  /**
   * 封面
   */
  cover: string;
  /**
   * 是否为草稿 1是0非
   */
  draft: string;
  /**
   * 草稿id
   */
  draftid: string;
  /**
   * 版块id
   */
  fid: string;
  /**
   * 附件是否付费
   */
  filePay: string;
  /**
   * 发帖来自
   */
  from: string;
  /**
   * 帖子id 编辑的时候传
   */
  id: string;
  /**
   * 图片
   */
  image: string;
  /**
   * 是否at用户
   */
  isAt: string;
  /**
   * 文章是否@关注的用户
   */
  isAttentionAt: string;
  /**
   * 是否关闭评论区1=>开启0=>关闭
   */
  isCloseComment: string;
  /**
   * 是否是匿名贴
   */
  isNameless: string;
  /**
   * 是否设置可见范围
   */
  isSee: string;
  /**
   * 是否支持匿名评论1=>支持0=>不支持
   */
  isSupportReplyNameless: string;
  /**
   * 是否是微博
   */
  isWeibo: string;
  /**
   * 通用版发帖是否有可见限制
   */
  lookJurisdiction: string;
  /**
   * 话题id
   */
  oid: string;
  /**
   * 支付金额
   */
  payAmount: string;
  /**
   * 图片是否付费
   */
  picturePay: string;
  /**
   * 产品id
   */
  productid: string;
  /**
   * 可见范围用户
   */
  seeDepartment: string;
  /**
   * 可见范围用户
   */
  seeUser: string;
  /**
   * 发送消息部门
   */
  sendDepartment: string;
  /**
   * 是否发送消息
   */
  sendMessage: string;
  /**
   * 发送消息用户
   */
  sendUser: string;
  /**
   * 帖子标题
   */
  title: string;
  /**
   * 话题
   */
  topic: string;
  /**
   * 帖子类型
   */
  type: string;
  /**
   * 帖子uid
   */
  uid: string;
  /**
   * 视频封面
   */
  videoCover: string;
  /**
   * 视频id
   */
  videoid: string;
  /**
   * 视频链接
   */
  videourl: string;
}
export interface IReply {
  /**
   * 视频腾讯云上的音频id
   */
  audioid: string;
  /**
   * 音频时长
   */
  audioTime: string;
  /**
   * 音频地址
   */
  audiourl: string;
  /**
   * 内容
   */
  content: string;
  /**
   * 图片
   */
  image: string;
  /**
   * 是否为匿名评论
   */
  isNameless: string;
  /**
   * 主题帖子id
   */
  threadid: string;
  /**
   * 对应楼层帖子post_id
   */
  toReplyid: string;
  /**
   * 回复楼中楼评论对应的评论id
   */
  toReplySecondid: string;
  /**
   * 回复评论时的评论作者uid
   */
  toReplyUid: string;
}

// @ts-ignore
export const useCommunityStore = defineStore('forumStore',{
    state:()=>({
        communityInfo:[],
        communityCate:[],
        communityPost:[],
        communityPostDetail:[],
        communityReply:[],
        communitySupport:[],
        communityCollect:[],
        communityCancelCollect:[],
    }),
    actions:{
        // 根据板块id来获取板块信息
        async getCommunityInfo(id){
            let communityInfoCache=localCache.get(`communityInfo_${id}`)
            if(communityInfoCache){
                this.communityInfo=communityInfoCache
            }
            let res=await post(community,{
                fid:id
            })
            // console.log(res);
            if(res.code===200){
            this.communityInfo=res.data
            // console.log(this.communityInfo,'this.communityInfo');
            localCache.set(`communityInfo_${id}`,this.communityInfo,60*60*12)
            }

        },
        // 获取板块下的所有分类
        async getCommunityCate(id){
            let communityCateCache=localCache.get(`communityCate_${id}`)
            if(communityCateCache){
                this.communityCate=communityCateCache
            }
            // if(localCache.get)
            let res=await post(cate,{
                fid:id
            })
            // console.log(res);
            if(res.code===200){
                this.communityCate=res.data
                // console.log(this.communityCate,'this.communityCate');
                localCache.set(`communityCate_${id}`,this.communityCate,60*60*12)
            }


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
            //   console.log(res.data,'返回数据')
                this.communityPost=res.data
                // console.log(this.communityPost,'this.communityPost');
                localCache.set(`communityPost_${id}-${page}-${type}`,this.communityPost,60*60*12)
            }

        },
        // 查看帖子详情
        async getCommunityPostDetail(id){
            let communityPostDetailCache=localCache.get(`communityPostDetail_${id}`)
            if(communityPostDetailCache){
                this.communityPostDetail=communityPostDetailCache
            }
            // @ts-ignore
          let res=await post(detail,{
                tid:id
            })
            // console.log('datail', res);
            if(res.code===200){
                this.communityPostDetail=res.data
                // console.log('chakan',this.communityPostDetail);
                localCache.set(`communityPostDetail_${id}`,this.communityPostDetail,60*60*12)
            }
        },
        //查看帖子回复
        async getCommunityPostReply(id,page=1){
            let communityReplyCache=localCache.get(`communityReply_${id}`)
            if(communityReplyCache){
                this.communityReply=communityReplyCache
            }
            try {
                let res=await post(replyList,{
                tid:id,
                page:page,
                row:10,
                type:1
            })
            // console.log('reply',res);
            if(res.code===200){
                this.communityReply=res.data
                // console.log(this.communityReply,'res');
                localCache.set(`communityReply_${id}`,this.communityReply,60*60*12)
            }
            } catch (error) {
                console.error(error)
            }

        },
        // 点赞帖子
        async getCommunityLike(model,id){
            let supportCache=localCache.get(`communitySupport_${model}_${id}`)
            if(supportCache){
                this.communitySupport=supportCache
            }
            let res=await post(doSupport,{
                model:model,
                row:id
            })
            // console.log(res,'doSupport');
            if(res.code===200){
                this.communitySupport=res.data
                localCache.set(`communitySupport_${model}_${id}`,this.communitySupport,60*60*12)
                // console.log(undefined);

            }

        },
        // 收藏帖子
        async getCommunityCollect(id){
            let collectCache=localCache.get(`communityCollect_${id}`)
            if(collectCache){
                this.communityCollect=collectCache
            }
            let res=await post(collect,{
                tid:id
            })
            // console.log(res.data,'collect');
            if(res.code==200){
                this.communityCollect=res.data
                localCache.set(`communityCollect_${id}`,this.communityCollect,60*60*12)
            }

        },
        // 取消收藏帖子
        async getCommunityCancelCollect(id){
            let cancelCollectCache=localCache.get(`communityCancelCollect_${id}`)
            if(cancelCollectCache){
                this.communityCancelCollect=cancelCollectCache
            }
            let res=await post(cancelCollect,{
                tid:id
            })
            // console.log(res.data,'cancelCollect');
            if(res.code===200){
                this.communityCancelCollect=res.data
                localCache.set(`communityCancelCollect_${id}`,this.communityCancelCollect,60*60*12)
            }
        },
        // 发布评论和回复评论，以及楼中楼
        async getCommunitythreadReply(authorId,content,tid,imageList:string='',to_reply_id='',to_reply_second_id='',is_nameless=0,audio_id='',audio_time='',audio_url=''):Promise<IReply>{
            try {
                let res=await post(threadReply,{
                thread_id:tid,
                content:content,
                image:imageList,
                to_reply_uid:authorId,
                is_nameless:is_nameless,
                to_reply_id:to_reply_id,
                to_reply_second_id:to_reply_second_id,
                audio_id:audio_id,
                audio_time:audio_time,
                audio_url:audio_url,

            })
            // console.log(res,'threadReply');
            // console.log(to_reply_id,to_reply_second_id,authorId,tid);

            } catch (error) {
                console.error(error)
            }
        },
        // 发布动态
        async getCommunityPublishPost(fid,image='',content,title,classId=67,is_close_comment=1,from='PC',type=1,is_weibo=1,cover=''):Promise<IThread>{
            // console.log(fid,image,content,title,'getCommunityPublishPost');

            try {
                let res=await post(threadPost,{
                    fid:fid,
                    image:image,
                    content:content,
                    class_id:classId,
                    is_close_comment:is_close_comment,
                    from:from,
                    title:title,
                    type:type,
                    is_weibo:is_weibo,
                    cover:cover,
                })
                // console.log(res,'threadPost');

            } catch (error) {
                console.error(error)
            }
        },
        async getPublishPost(fid,image='',content,title,cover='',classId=67,is_close_comment=1,from='PC',type=1):Promise<IThread>{
            console.log(fid,image,content,title,classId=67,is_close_comment=1,from='PC',type=1,cover,'getCommunityPublishPost');

            try {
                let res=await post(threadPost,{
                    fid:fid,
                    image:image,
                    content:content,
                    class_id:classId,
                    is_close_comment:is_close_comment,
                    from:from,
                    title:title,
                    type:type,
                    cover:cover,
                })
                // console.log(res,'threadPost');

            } catch (error) {
                console.error(error)
            }
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

