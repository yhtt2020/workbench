<script lang="ts">
import XtButton from "../card/libs/Button/index.vue";
import {message} from "ant-design-vue";
import TencentCloudChat from "tim-js-sdk";
import {mapState} from "pinia";
import {appStore} from "../../store";

export default {
  name: "addFriendButton",
  components: {XtButton},
  props:[
    'uid'
  ],
  emits:['loaded'],
  computed:{
    ...mapState(appStore, {
      'myUserInfo': 'userInfo'
    }),
  },
  mounted(){
   this.checkFriendship()
  },
  data(){
    return {
      relationship:'unload'
    }
  },
  methods:{
    addFriend () {
      let promise = window.$chat.addFriend({
        to: String(this.uid),
        source: 'AddSource_Type_UserCard',
        remark: '通过好友列表添加',
        wording: '加为好友',
        type: TencentCloudChat.TYPES.SNS_ADD_TYPE_BOTH
      })
      promise.then((imResponse) => {
        const { code } = imResponse.data
        if (code === 30539) {
          message.info('申请加为好友成功，等待对方通过。')
        } else if (code === 0) {
          message.success('添加好友成功。')
          this.relationship = 'yes'
        }
      }).catch((imError) => {
        message.error('添加好友失败。')
        console.error(imError)
      })
    },
    deleteFriend () {
      let promise = window.$chat.deleteFriend({
        userIDList: [String(this.uid)],
        type: TencentCloudChat.TYPES.SNS_DELETE_TYPE_BOTH
      })
      promise.then((imResponse) => {
        const { successUserIDList, failureUserIDList } = imResponse.data
        // 删除成功的 userIDList
        successUserIDList.forEach((item) => {
          const { userID } = item
          if (userID === String(this.uid)) {
            message.success('删除好友成功。')
            this.relationship = 'not'
          }
        })
        // 删除失败的 userIDList
        failureUserIDList.forEach((item) => {
          const { userID, code, message } = item
          if (userID === String(this.uid)) {
            message.error('删除好友失败。')
          }
        })
        // 如果好友列表有变化，则 SDK 会触发 TencentCloudChat.EVENT.FRIEND_LIST_UPDATED 事件
      }).catch(function (imError) {
        message.error('删除好友意外失败。', imError)
      })
    },
    async checkFriendship () {
      if (this.uid !== this.myUserInfo.uid) {
        //不是本人，则需要验证好友关系
        console.log('需要检查')
        try {
          console.log([String(this.uid)])
          let rs = await window.$TUIKit.tim.checkFriend({
            userIDList: [String(this.uid)],
            type: TencentCloudChat.TYPES.SNS_CHECK_TYPE_SINGLE
          })
          const { successUserIDList, failureUserIDList } = rs.data
          let item = successUserIDList[0]
          const { userID, code, relation } = item
          if (userID === '@TLS#NOT_FOUND') {
            this.relationship = 'unknown'
          } else {
            if (relation === TencentCloudChat.TYPES.SNS_TYPE_NO_RELATION) {
              this.relationship = 'not'
            } else {
              this.relationship = 'yes'
            }
          }
        } catch (e) {
          return this.relationship = 'unknown'
        }
      }
    },
  }
}
</script>

<template>
  <XtButton @click="addFriend" v-if="relationship==='not'" type="theme"  style="width: 100%"
            class="rounded-full w-full">
    <icon style="font-size: 16px" class="mr-1" icon="tianjia1"></icon>
    加为好友
  </XtButton>
  <XtButton @click="deleteFriend" v-else-if="relationship==='yes'" style="width: 100%"
            class="rounded-full w-full">
    <icon style="font-size: 16px" class="mr-1" icon="guanbi2"></icon>
    解除好友
  </XtButton>
</template>

<style scoped lang="scss">

</style>
