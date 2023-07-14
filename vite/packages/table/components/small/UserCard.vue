<template>
  <div style="max-width: 100%;width: 360px" class="flex-col py-4">
    <div class="flex items-center my-3 mx-3">
      <div class="pt-2 ml-2" style="width:70px;height:70px;position:relative;text-align: center;">
<<<<<<< HEAD
        <FrameAvatar :avatarSize="60" :avatarUrl="displayUserInfo.avatar" :frameUrl="displayUserInfo.equippedItems?.frameDetail?.image">
=======
        <FrameAvatar :frame="displayUserInfo?.equippedItems?.frameDetail" :avatarSize="60" :avatarUrl="displayUserInfo.avatar" :frameUrl="displayUserInfo.equippedItems?.frameDetail?.image">
>>>>>>> 8bb1f868fa0a641a9af49bef0f7f54328ab2c821
        </FrameAvatar>
        <a-tooltip v-if="displayUserInfo.certification && displayUserInfo.certification.length>0"
                   :title="displayUserInfo.certification[0].name">
          <a-avatar style="position: absolute;width: 20px;height:20px;right: -15px;bottom: 0;z-index: 999;"
                    :src="displayUserInfo.certification[0].attestation_icon"></a-avatar>
        </a-tooltip>
      </div>
      <div class="flex flex-col ml-2 " style="flex: 1">
        <div class="mb-1  font-bold truncate"> {{ displayUserInfo.nickname }}</div>
        <div>
          <div class="rounded-md px-2 bg-mask inline-block font-bold" style="background: var(--primary-bg);width: auto">UID: {{
              uid
            }}
          </div>
        </div>

      </div>
    </div>
    <div class="flex flex-col mb-4">
      <div class="bg-mask rounded-lg py-3 px-2 m-3 mx-5 mt-2 mb-2 "
           style="min-height: 24px;background: var(--primary-bg);color:var(--primary-text);">
        个性签名：
        {{ displayUserInfo.signature || '暂无签名' }}
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
  </div>

</template>

<script>
import { mapActions, mapState } from 'pinia'
import { teamStore } from '../../store/team'
import Medal from '../team/Medal.vue'
import OnlineMedal from '../team/OnlineMedal.vue'
import OnlineGradeDisplay from '../team/OnlineGradeDisplay.vue'
import { appStore } from '../../store'
import FrameAvatar from '../avatar/FrameAvatar.vue'
<<<<<<< HEAD

export default {
  name: 'UserCard',
  components: { FrameAvatar, Medal, OnlineMedal, OnlineGradeDisplay },
=======
import FrameStoreWidget from '../team/FrameStoreWidget.vue'

export default {
  name: 'UserCard',
  components: { FrameStoreWidget, FrameAvatar, Medal, OnlineMedal, OnlineGradeDisplay },
>>>>>>> 8bb1f868fa0a641a9af49bef0f7f54328ab2c821
  props: ['uid', 'visible', 'userInfo'],
  emits: ['visibleChanged'],
  data () {
    return {
      grade: {},
      medals: [],
      key: Date.now(),
      userCardUserInfo: {}
    }
  },
  watch: {
    'uid': {
      async handler () {
        this.updateUserInfo()
        this.updateUserMedal()
        this.grade = await this.getMemberGrade(this.uid)
        this.key = Date.now()
      }
    }
  },
  computed: {
    displayUserInfo () {
      console.log(this.userCardUserInfo)
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
      console.log(response, '用户信息')
      if (response.code === 200) {

        const data = response.data
        this.userCardUserInfo = {
          uid: this.uid,
          nickname: data.user.nickname,
          avatar: data.user.avatar_128,
          signature: data.user.signature,
          certification: data.user.all_certification_entity_pc || [],
          equippedItems: data.equippedItems
        }
      }
      console.log(this.userCardUserInfo)
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
