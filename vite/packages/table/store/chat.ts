import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {get, post} from "../js/axios/request";
import {serverCache, localCache} from '../js/axios/serverCache'
import TUIKit from "../TUIKit";


const getUserSigUrl = sUrl('/app/chat/getUserSig')
import {appStore} from "../store";
import * as sns from "../js/common/sns";
import {result} from "lodash-es";
import _ from "lodash-es";
// @ts-ignore
export const chatStore = defineStore('chatStore', {
    state: () => ({
      userSig: '',
      limitTotal: '200',
      users: [
        {
          uid: '4',
          reason: '阿皮大号'
        },
        {uid: '36', reason: '想天小客服'},
        {uid: '10', reason: '测试同学'},
        {uid: '23', reason: '产品同学'}
      ],
      group: [
        {groupID: 'suggest'},// {groupID:'noob'},{groupID:'bug'},{groupID:'fans'},
        // {groupID:'update'},{groupID:'develop_group'},
        // {groupID:'trade'},{groupID:'developer'},{groupID:'3dprint'},{groupID:'screen_diy'},
        // {groupID:'player'},{groupID:'3dgitial'},
      ],
      settings: {
        showDouble: false,  // 是否展示社群双列
      },
      isLoading: false,//是否在加载中

      //推荐数据
      recommendData: {
        users: [],
        groups: []
      },
      refUser: [], // 接收推荐用户数据
      groupList: [],  // 接收推荐群数据
      memberList: [], // 成员列表数据
    }),
    actions: {
      async getUserSig() {

        const getRs = await get(getUserSigUrl)
        if (getRs.status) {
          this.userSig = getRs.data
        }
      },

      async updateUserInfo() {
        let userInfo = appStore().userInfo
        let rs = await window.$TUIKit.tim.updateMyProfile({
          nick: userInfo.nickname,
          avatar: userInfo.avatar,
          selfSignature: String(userInfo.signature),

        })
        console.log('尝试更新用户信息结果', rs)
      },

      async login() {
        await this.getUserSig()
        await window.$TUIKit.login({
          userID: String(appStore().userInfo.uid),
          userSig: this.userSig, // The password with which the user logs in to IM. It is the ciphertext generated by encrypting information such as userID.For the detailed generation method, see Generating UserSig
        });
        await this.updateUserInfo()
      },

      setDouble(value: any) {
        this.settings.showDouble = value
      },

      async loadRecommendUsers() {
        const findStore = appStore()
        // const recommendList = {refUser: [], group: []}
        let users = []
        // 遍历获取推荐用户
        for (let i = 0; i < this.users.length; i++) {
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
        //let friendships= (await sns.checkFriendship(this.uid))==='yes'

        this.recommendData.users = users //常规写法
      },
      async updateUsersRelationship(){

        let users =this.recommendData.users
        let uids=this.users.map(u=>{
          return u.uid
        })
        let relations = await sns.checkFriendship(uids) //todo 当只有一个用户的时候，这个返回的是一个字符串，而不是数组
        //用户后处理，处理他的好友关系
        for (const user of users) {
          user.reason = await user.reason //添加上原因
          //todo 检测好友关系
        }
        if (users.length === 1) {
          console.log(users);
          
          //一个推荐用户的特殊情况
          users[0].relationship = relations
        } else {
          for (let i = 0; i < uids.length; i++) {
            users[i].relationship = relations[i]
          }
        }
      },


      async loadRecommendGroups() {
        let groups = []
        // 遍历获取推荐群聊
        for (let i = 0; i < this.group.length; i++) {
          const option = {
            groupID: this.group[i].groupID
          }
          const result = await window.$chat.getGroupProfile(option)
          const group = {...result.data.group,relationShip:''}
          groups.push(group)
        }

        this.recommendData.groups = groups
      },

      async loadGroupRelationship(){
        let groups = this.recommendData.groups
        let groupIDs = groups.map((u)=>{
          return u.groupID
        })
        const groupShip = await sns.checkGroupShip(groupIDs[0])
        // console.log('最后结果',groupShip);
        if(groups.length === 1){
          groups[0].relationShip = groupShip[0]
        }else{
          for(let i=0;i<groupIDs.length;i++){
            groups[i].relationShip = groupShip[i]
          }
        }
        
      },

      async loadRecommendData() {
        const time1 = Date.now()
        Promise.all([this.loadRecommendUsers(), this.loadRecommendGroups()]).then(result => {
          this.updateUsersRelationship()
          this.loadGroupRelationship()
          console.log(result)
          //群组后处理，处理他的群成员关系
          this.isLoading = false
          localCache.set('findData', this.recommendData, 10 * 60)
          serverCache.setData('findData', this.recommendData, 10 * 60)
        })


      },

      // async getMember() {
      //   for (let i = 0; i < this.group.length; i++) {
      //     const option = {
      //       groupID: this.group[i].groupID,
      //       count: 100,
      //       offset: 0,
      //     }
      //     const res = await window.$chat.getGroupMemberList(option)
      //     this.memberList = res.data.memberList
      //   }
      // },

      async getReferData() {  // 获取推荐用户数据
        try {
          if(this.recommendData.users.length){
            this.recommendData.users.forEach(user=>{
              delete user.relationship
            })
          }


          const result = await serverCache.getDataWithLocalCache('findData', {
            localCache: true, ttl: 10 * 60,
            cache: false
          })
          if (result) { //去除缓存
            this.recommendData=result
            this.updateUsersRelationship()
            this.loadGroupRelationship()
            this.isLoading = false
          } else {
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

      }
    },

    persist: {
      enabled: true,
      strategies: [{
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: dbStorage,
        paths: ['settings', 'recommendData']
        // state 中的字段名，按组打包储存
      }]
    }
  }
)


