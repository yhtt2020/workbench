import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {post} from "../js/axios/request";
import {localCache} from '../js/axios/serverCache'

const myForum = sUrl('/app/com/forum/my')
const threadList = sUrl('/app/com/forum/getThreadList')

// @ts-ignore
export const yuanCommunityStore = defineStore("yuanCommunity", {
  state: () => ({
    myForumList: [],
    communityPost: [],
    saveContent: '',
    saveDynamic: '',
    saveTitle: '',
    // 保存帖子相关内容
    postContent: {
      title: '',
      content: '',
      imagesList: '',
      coverList: ''
    },
    // 保存动态相关内容
    dynamicContent: {
      content: "",
      imagesList: []
    },
    // 列表
    forumsList: [],
    defaultSection: '版本更新',
    defaultForum:{index:0,value:{id:100304,name:'版本更新'}}
  }),
  actions: {
    // 获取我的圈子
    async getMyForumList() {
      const cacheData = localCache.get('myForumList')
      if (cacheData) {
        this.myForumList = cacheData
      }
      const res = await post(myForum)
      if (res.code === 200) {
        this.myForumList = [...this.getData(res.data.joined),...this.getData(res.data.create)]
      }

      localCache.set('myForumList', this.cleanData(this.myForumList), 60 * 60 * 12)
      // console.log(this.myForumList ,'myForum');

    },
    /**
     * 清理数据
     * @param data
     */
    cleanData(data) {
      function cleanItem(li) {
        delete li.members
        return li
      }

      if (data.create) {
        data.create = data.create.map(li => {
          return cleanItem(li)
        })
      }
      if (data.joined) {
        data.joined = data.joined.map(li => {
          return cleanItem(li)
        })
      }
      return data
    },
    // 处理帖子数据
    refreshData(data){
      return {
        fid: data.fid,  //版块id
        author_id: data.author_id,  // 发帖人id
        create_time: data.create_time,  // 发帖时间
        id: data.id,  // 帖子id
        forum:{
          id:data.forum.id,  //版块id
          name:data.forum.name,  //版块名称
          logo:data.forum.logo  //版块logo
        },
        title:data.title,  //帖子标题
        time:data.time,  //发帖时间
        image_170_170:data.image_170_170,  //帖子图片*（缩略图）
        image:data.image,  //帖子图片
        is_collect:data.is_collect,  //是否收藏
        is_support:data.is_support,  //是否点赞
        reply_count:data.reply_count,  //回复数
        summary:data.summary,  //帖子摘要
        pc_summary:data.pc_summary,  //pc端帖子摘要
        user:{
          uid:data.user.uid,  //发帖人id
          nickname:data.user.nickname,  //发帖人昵称
          ip_home:data.user.ip_home,  //发帖人ip
          avatar_64:data.user.avatar_64,  //发帖人头像
          avatar:data.user.avatar  //发帖人头像
        },
        pay_set:{
          tid:data.pay_set.tid  //帖子id
        }  
      }
    },
    getData(data){
      const list=data.map((item)=>{
        return {
          value:item.id,
          name:item.name
        }
      })
      return list
    },
    // 获取查询板块下的所有帖子
    async getCommunityPost(id, page = 1, type = 'all', order = '') {
      let communityPostCache = localCache.get(`communityPost_${id}-${page}-${type}`)
      if (communityPostCache) {
        this.communityPost = communityPostCache
      }
      let res = await post(threadList, {
        fid: id,
        page: page,
        row: 10,
        type: type,
        classId: 67,
        order: order
      })
      if (res.code === 200) {
        // console.log(res.data,'返回数据')
        // this.communityPost = res.data.list
        // console.log(this.communityPost,'this.communityPost');
        const list = res.data.list.map((item) => {
          return this.refreshData(item)
        })
        this.communityPost = list
        // console.log(this.communityPost,'this.communityPost');
        localCache.set(`communityPost_${id}-${page}-${type}`, this.communityPost, 60 * 60 * 1)
      }

    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['myForumList', 'communityPost'],
      }
    ]
  }
})
