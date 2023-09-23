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

export const useCommunityStore = defineStore('forumStore',{
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
            if(res.code===200){
            this.communityInfo=res.data
            // console.log(this.communityInfo,'this.communityInfo');
            localCache.set(`communityInfo_${id}`,this.communityInfo,60*60*12)
            }

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
                localCache.set(`communityCate_${id}`,this.communityCate,60*60*12)
            }


        },
        // 获取查询板块下的所有帖子
        async getCommunityPost(id,page=1,type='all',order=''){
            if(localCache.get(`communityPost_${id}-${type}`)){
                this.communityPost=localCache.get(`communityPost_${id}-${type}`)
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
            if(localCache.get(`communityPostDetail_${id}`)){
                this.communityPostDetail=localCache.get(`communityPostDetail_${id}`)
            }
            let res=await post(detail,{
                tid:id
            })
            // console.log('datail', res);
            if(res.code===200){
                this.communityPostDetail=res.data
                console.log('chakan',this.communityPostDetail);
                localCache.set(`communityPostDetail_${id}`,this.communityPostDetail,60*60*12)
            }
        },
        //查看帖子回复
        async getCommunityPostReply(id,page=1){
            if(localCache.get(`communityReply_${id}`)){
                this.communityReply=localCache.get(`communityReply_${id}`)
            }
            let res=await post(replyList,{
                tid:id,
                page:page,
                row:10,
                type:1
            })
            // console.log('reply',res);
            if(res.code===200){
                this.communityReply=res.data
                console.log(this.communityReply,'res');
                localCache.set(`communityReply_${id}`,this.communityReply,60*60*12)
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

