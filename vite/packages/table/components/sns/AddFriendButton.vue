<script lang="ts">
import {message} from "ant-design-vue";
import TencentCloudChat from "tim-js-sdk";
import {mapState} from "pinia";
import {appStore} from "../../store";
import * as sns from '../../js/common/sns'

export default {
  name: "AddFriendButton",
  props: [
    'uid'
  ],
  emits: ['loaded', 'relationshipChanged'],
  computed: {
    ...mapState(appStore, {
      'myUserInfo': 'userInfo'
    }),
  },
  async mounted() {
    await this.checkFriendship()
    this.$emit('loaded')
  },
  data() {
    return {
      relationship: 'unload'
    }
  },
  methods: {
    addFriend() {
      let promise = window.$chat.addFriend({
        to: String(this.uid),
        source: 'AddSource_Type_UserCard',
        remark: '通过好友列表添加',
        wording: '加为好友',
        type: TencentCloudChat.TYPES.SNS_ADD_TYPE_BOTH
      })
      promise.then((imResponse) => {
        const {code} = imResponse.data
        if (code === 30539) {
          message.info('申请加为好友成功，等待对方通过。')
        } else if (code === 0) {
          message.success('添加好友成功。')
          this.relationship = 'yes'
          this.$emit('relationshipChanged', {relationship: this.relationship})
        }
      }).catch((imError) => {
        message.error('添加好友失败。')
        console.error(imError)
      })
    },
    deleteFriend() {
      let promise = window.$chat.deleteFriend({
        userIDList: [String(this.uid)],
        type: TencentCloudChat.TYPES.SNS_DELETE_TYPE_BOTH
      })
      promise.then((imResponse) => {
        const {successUserIDList, failureUserIDList} = imResponse.data
        // 删除成功的 userIDList
        successUserIDList.forEach((item) => {
          const {userID} = item
          if (userID === String(this.uid)) {
            message.success('删除好友成功。')
            this.relationship = 'not'
            this.$emit('relationshipChanged', {relationship: this.relationship})
          }
        })
        // 删除失败的 userIDList
        failureUserIDList.forEach((item) => {
          const {userID, code, message} = item
          if (userID === String(this.uid)) {
            message.error('删除好友失败。')
          }
        })
        // 如果好友列表有变化，则 SDK 会触发 TencentCloudChat.EVENT.FRIEND_LIST_UPDATED 事件
      }).catch(function (imError) {
        message.error('删除好友意外失败。', imError)
      })
    },
    async checkFriendship() {
      this.relationship = await sns.checkFriendship(this.uid)
      this.$emit('relationshipChanged', {relationship: this.relationship})
    },
  }
}
</script>

<template>
  <XtButton @click="addFriend" v-if="relationship==='not'" type="theme" style="width: 100%"
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
