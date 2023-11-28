import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {get, post} from "../js/axios/request";
import {serverCache, localCache} from '../js/axios/serverCache'
import TUIKit from "../TUIKit";

const getUserSigUrl = sUrl('/app/chat/getUserSig')
import {appStore} from "../store";
import * as sns from "../js/common/sns";
import _ from "lodash-es";
import { communityStore } from '../page/chat/store/communityStore'

// @ts-ignore
export const chatStore = defineStore('chatStore',{
  state:()=> ({
    userSig: '',
    limitTotal: '200',
    users:[
      {uid: '4', reason: '阿皮大号' },
      {uid: '36', reason: '想天小客服'},
      {uid: '10', reason: '测试同学'},
      {uid: '23', reason: '产品同学'}
    ],
    group:[
      {groupID: 'suggest'}, {groupID:'noob'},
      {groupID:'bug'},{groupID:'fans'},
      {groupID: 'update'}, {groupID: 'develop_group'},
      {groupID: 'trade'}, {groupID: 'developer'},
      {groupID: '3dprint'}, {groupID: 'screen_diy'},
      {groupID: 'player'}, {groupID: '3cdigital'},
    ],
    //是否在加载中
    isLoading: false,
    //推荐数据
    recommendData: {
      users: [],
      groups: []
    },
    // 存储上一次会话记录
    conversations: {
      conversationID: (window as any).$TUIKit.TUIServer?.TUIConversation.currentStore?.currentConversationID,
    },
    //  开关设置
    settings:{
      showDouble: false,  // 是否展示社群双列
      enableHide:false, // 隐藏边栏
    },
    //通讯录数据存储
    contactsSet:{
      noticeNum:0,
      unReadMsgNum:[], // 群聊消息未读数
    }
  }),

  actions:{
    async getUserSig() {
      const getRs = await get(getUserSigUrl)
      if (getRs.status) {
        this.userSig = getRs.data
      }
    },


    async updateUserInfo() {
      let userInfo = appStore().userInfo
      // let rs =
      await (window as any).$TUIKit.tim.updateMyProfile({
        nick: userInfo.nickname,
        avatar: userInfo.avatar,
        selfSignature: String(userInfo.signature),
      })
      // console.log('尝试更新用户信息结果', rs)
    },


    async login() {
      await this.getUserSig()
      await (window as any).$TUIKit.login({
        userID: String(appStore().userInfo.uid),
        userSig: this.userSig, // The password with which the user logs in to IM. It is the ciphertext generated by encrypting information such as userID.For the detailed generation method, see Generating UserSig
      });
      await this.updateUserInfo()
      communityStore().getMyCommunity()
    },


    // 遍历获取推荐用户数据
    async loadRecommendUsers(){
      const findStore = appStore()
      let users = []
      // 遍历获取推荐用户
      for (let i = 0; i < this.users.length; i++){
        const uid = this.users[i].uid
        const userRes = await findStore.getUserCard(uid)
        const referItem = {
          uid: userRes.data.user.uid,
          nickname: userRes.data.user.nickname,
          avatar: userRes.data.user.avatar,
          reason: this.users[i].reason
        }
        users.push(referItem)
      }
      //用户后处理，处理他的好友关系
      for (const user of users) {
        user.reason = await user.reason //添加上原因
        //todo 检测好友关系
      }
      this.recommendData.users = users //常规写法
      return users
    },

    // 遍历获取推荐群聊数据
    async loadRecommendGroups(){
      let groups = []
      // 遍历获取推荐群聊
      for (let i = 0; i < this.group.length; i++){
        try {
          const option = this.group[i].groupID

          // console.log('排查配置项',option);

          const result = await (window as any).$chat.searchGroupByID(option)

          // console.log('排查结果',result);

          const group = {...result.data.group, relationShip: ''}
          groups.push(group)

        } catch (error) {
          console.warn(this.group[i].groupID, error)
        }
      }
      this.recommendData.groups = groups
      return groups
    },


    // 判断推荐用户好友关系
    async updateUsersRelationship() {
      let users = this.recommendData.users
      let uids = this.users.map(u => {
        return u.uid
      })

      //todo 当只有一个用户的时候，这个返回的是一个字符串，而不是数组
      let relations = await sns.checkFriendship(uids)
      //用户后处理，处理他的好友关系
      for (const user of users) {
        user.reason = await user.reason //添加上原因
        //todo 检测好友关系
      }
      if (users.length === 1){
        users[0].relationship = relations
      }else{
        for (let i = 0; i < uids.length; i++) {
          users[i].relationship = relations[i]
        }
      }
    },


    // 判断推荐群关系
    async updateGroupRelationship() {
      let groups = this.recommendData.groups
      let groupIDs = groups.map(async(u) => {
        return u.groupID
      })
      const groupShip = await sns.checkGroupShip(groupIDs)
      if (groups.length === 1) {
        groups[0].relationShip = groupShip[0]
      } else {
        for (let i = 0; i < groupIDs.length; i++) {
          groups[i].relationShip = groupShip[i]
        }
      }
    },

    // 同时获取推荐数据
    async loadRecommendData(){
      Promise.all([this.loadRecommendUsers(),this.loadRecommendGroups()]).then((result:any)=>{
        this.updateUsersRelationship()
        this.updateGroupRelationship()

        // console.log('获取结果',);
        // console.log('排查结果::>>', );

        this.isLoading = false
        // 判断是否为空数据,如果不是就进行缓存
        if(this.recommendData.groups.length !== 0 &&  this.recommendData.users !== 0 && !result.includes(undefined)){
          localCache.set('findData', this.recommendData, 10 * 60)
          serverCache.setData('findData', this.recommendData, 10 * 60)
        }
      })
    },


    async getReferData(){
      // this.loadRecommendData()
      try {
        if (this.recommendData.users.length) {
          this.recommendData.users.forEach(user => {
            delete user.relationship
          })
        }
        if (this.recommendData.groups.length) {
          this.recommendData.groups.forEach(group => {
            delete group.relationship
          })
        }

        const result = await serverCache.getDataWithLocalCache('findData', {
          localCache: true, ttl: 10 * 60,
          cache: false
        })
        // console.log('排查数据',result);

        if(result && result !== undefined){
          this.recommendData = result
          this.updateUsersRelationship()
          this.updateGroupRelationship()
          this.isLoading = false
        }else{
          // this.recommendData = {
          //   users: [],
          //   groups: []
          // }

          console.warn('获取数据失败,返回undefined', result);
          this.isLoading = this.recommendData.users.length === 0
          this.loadRecommendData()
        }

      } catch (error) {
        console.error('获取数据失败', error)
      }
    },


    setDouble() {
      this.settings.showDouble=!this.settings.showDouble
    },

    setFloatVisible(value:any){
      localCache.set('float',value,30*60)
      this.settings.enableHide = localCache.get('float')
    },


    updateNum(option:any){
      this.contactsSet = option
    },

    updateConversation(val:any){
      this.conversations.conversationID = val
    },



  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['settings', 'recommendData', 'conversations']
      // state 中的字段名，按组打包储存
    }]
  }
})
