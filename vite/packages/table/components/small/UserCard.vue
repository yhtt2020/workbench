<template>
  <div style="max-width: 100%;width: 360px" class="flex-col">
    <div class="flex items-center my-3 mx-3">
      <div class="pt-2 ml-2" style="width:70px;height:70px;position:relative;text-align: center;">
        <FrameAvatar :frame="displayUserInfo?.equippedItems?.frameDetail" :avatarSize="60"
                     :avatarUrl="displayUserInfo.avatar" :frameUrl="displayUserInfo.frame">
        </FrameAvatar>
        <a-tooltip v-if="displayUserInfo.certification && displayUserInfo.certification.length>0"
                   :title="displayUserInfo.certification[0].name">
          <a-avatar style="position: absolute;width: 20px;height:20px;right: -15px;bottom: 0;z-index: 999;"
                    :src="displayUserInfo.certification[0].attestation_icon"></a-avatar>
        </a-tooltip>
      </div>
      <div class="flex flex-col ml-2 " style="flex: 1">
        <div class="mb-1  xt-text font-bold truncate"> {{ displayUserInfo.nickname }}</div>
        <div>
          <div class="rounded-md px-2 bg-mask inline-block font-bold" style="background: var(--primary-bg);width: auto">
            UID: {{
              uid
            }}
          </div>
        </div>

      </div>
      <div>
        <a-dropdown overlayClassName="xt-text " overlayStyle="background:var(--primary-bg-solid)">
          <div class="xt-text p-3 cursor-pointer">
            <icon icon="gengduo2"></icon>
          </div>

          <template #overlay>
            <a-menu style="background: none"  @click="handleMenuClick">
              <a-menu-item class="xt-text" v-show="inBlackList!=='unload'" v-if="inBlackList==='not'" @click="addToBlacklist" key="1">
                <icon style="font-size: 16px" class="mr-1" icon="chengyuan"></icon>
                拉黑
              </a-menu-item>
              <a-menu-item class="xt-text" v-show="inBlackList!=='unload'" v-if="inBlackList==='yes'" @click="removeFromBlacklist">
                <icon style="font-size: 16px" class="mr-1" icon="chengyuan"></icon>
                取消拉黑
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div class="flex flex-col mb-4">
      <div class="bg-mask rounded-lg py-3 px-2 m-3 mx-5 mt-2 mb-2  "
           style="min-height: 24px;background: var(--primary-bg);color:var(--primary-text);">
        个性签名：
        <div class="px-2" style="word-break: break-all;white-space: pre-wrap">{{ displayUserInfo.signature || '暂无签名' }}</div>
      </div>
      <div class="bg-mask rounded-lg p-3 mx-5 m-3 mt-2 mb-0 "
           style="min-height: 77px;background: var(--primary-bg);color: var(--primary-text) ;">
        <OnlineGradeDisplay :key='key' :grade="grade.grade" :extra="grade"></OnlineGradeDisplay>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="mb-4 pd-0 m-3 p-1 mx-5 mt-0" style="color: var(--primary-text);">
        成就勋章
      </div>
      <div class="bg-mask rounded-lg p-3 m-3 mx-5 mt-0  "
           style="background: var(--primary-bg);color: var(--primary-text) ;">
        <OnlineMedal v-if="grade.rank" :rank="grade.rank"></OnlineMedal>
        <Medal :medal="medal" v-for="medal in medals"></Medal>
      </div>
    </div>
    <div class="px-5 pb-4" v-if="uid!==myUserInfo.uid" v-show="relationship!=='unload'">
      <a-row :gutter="12" v-if="relationship!=='unknown'">
        <a-col :span="12">
          <XtButton @click="addFriend" v-if="relationship==='not'"  style="width: 100%"
                    class="rounded-full w-full">
            <icon style="font-size: 16px" class="mr-1" icon="tianjia1"></icon>
            加为好友
          </XtButton>
          <XtButton @click="deleteFriend" v-else-if="relationship==='yes'" style="width: 100%"
                    class="rounded-full w-full">
            <icon style="font-size: 16px" class="mr-1" icon="guanbi2"></icon>
            解除好友
          </XtButton>
        </a-col>

        <a-col  :span="12">
          <XtButton @click="sendMessage" :type="relationship==='yes'?'theme':'default'" style="width:100%">发消息</XtButton>
        </a-col>
      </a-row>
      <div class="text-center" v-else>
        <icon icon="tishi-xianxing"></icon>
        对方未登录过社群，无法使用好友功能
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia'
import { teamStore } from '../../store/team'
import Medal from '../team/Medal.vue'
import OnlineMedal from '../team/OnlineMedal.vue'
import OnlineGradeDisplay from '../team/OnlineGradeDisplay.vue'
import { appStore } from '../../store'
import FrameAvatar from '../avatar/FrameAvatar.vue'
import FrameStoreWidget from '../team/FrameStoreWidget.vue'
import TencentCloudChat from 'tim-js-sdk'
import { message } from 'ant-design-vue'

export default {
  name: 'UserCard',
  components: {  FrameStoreWidget, FrameAvatar, Medal, OnlineMedal, OnlineGradeDisplay },
  props: ['uid', 'visible', 'userInfo'],
  emits: ['visibleChanged'],
  data () {
    return {
      grade: {},
      medals: [],
      key: Date.now(),
      userCardUserInfo: {},
      relationship: 'unload',
      inBlackList: 'unload',
    }
  },
  watch: {
    'uid': {
      async handler () {
        this.updateUserInfo()
        this.updateUserMedal()
        this.grade = await this.getMemberGrade(this.uid)
        this.key = Date.now()
        this.checkFriendship()
        this.checkBlacklist()
      }
    }
  },
  computed: {
    ...mapState(appStore, {
      'myUserInfo': 'userInfo',
    }),
    ...mapWritableState(appStore,['userCardVisible']),
    displayUserInfo () {
      if (this.userCardUserInfo) {
        return {
          ...this.userCardUserInfo,
          certification: []
        }
      } else if (this.userInfo) {
        return this.userInfo
      } else {
        return {}
      }
    }
  },
  async mounted () {
    if (this.userInfo) {
      //如果存在用户数据，则使用此数据显示卡片
      this.userCardUserInfo = this.userInfo
    }
    if (!this.uid) {
      return
    }
    this.updateUserInfo()
    this.updateUserMedal()
    this.grade = await this.getMemberGrade(this.uid)
  },
  methods: {
    ...mapActions(teamStore, ['getMemberGrade', 'getUserMedal']),
    ...mapActions(appStore, ['getUserCard']),
    async updateUserInfo () {
      let response = await this.getUserCard(this.uid)
      if (response.code === 200) {

        const data = response.data
        this.userCardUserInfo = {
          uid: this.uid,
          nickname: data.user.nickname,
          avatar: data.user.avatar_128,
          frame:data.frame,
          signature: data.user.signature,
          certification: data.user.all_certification_entity_pc || [],
          equippedItems: data.equippedItems
        }
      }
      this.checkFriendship()
      this.checkBlacklist()
    },
    addToBlacklist () {
      let promise = window.$chat.addToBlacklist({ userIDList: [String(this.uid)] }) // 请注意：即使只添加一个用户账号到黑名单，也需要用数组类型，例如：userIDList: ['user1']
      promise.then((imResponse) => {
        if (imResponse.data.includes(String(this.uid))) {
          this.inBlackList = 'yes'
          this.relationship = 'not'
          message.success('拉黑成功。')
        }
      }).catch(function (imError) {
        message.error('拉黑意外失败。', imError)
      })
    },
    removeFromBlacklist () {
      let promise = $chat.removeFromBlacklist({ userIDList: [String(this.uid)] }) // 请注意：即使只从黑名单中移除一个用户账号，也需要用数组类型，例如：userIDList: ['user1']
      promise.then((imResponse) => {
        message.success('取消拉黑成功。')
        this.inBlackList = 'not'
      }).catch(function (imError) {
        message.error('取消拉黑失败。')
      })
    },
    addFriend () {
      if (this.inBlackList === 'yes') {
        message.error('必须先解除黑名单才可加为好友。')
        return
      }
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
    async checkBlacklist () {
      let promise = $chat.getBlacklist()
      promise.then((imResponse) => {
        if (imResponse.data.includes(String(this.uid))) {
          this.inBlackList = 'yes'
        } else {
          this.inBlackList = 'not'
        }
      }).catch((imError) => {
        this.inBlackList = 'not'
        console.warn('getBlacklist error:', imError) // 获取黑名单列表失败的相关信息
      })
    },
    sendMessage(){
      if(this.inBlackList==='yes' || this.relationship!=='yes'){
        message.error('非好友无法发起对话，请先加对方为好友。')
      }else{
        this.userCardVisible=false
        this.$router.push({
          name:'chatMain',
          params:{
            action:'sendMessage',
            uid:String(this.uid)
          }

        })
      }
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
    updateUserMedal () {
      this.getUserMedal(this.uid).then(result => {
        if (result) {
          this.medals = result
        } else {
          this.medals = []
        }
      })
    }
  },
}
</script>

<style scoped>
.user-frame {
  position: absolute;
  top: 28%;
  left: 27%;
  z-index: 0;
}
</style>
