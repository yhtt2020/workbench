<template>
  <a-row :gutter="20" style="color:var(--primary-text);">
    <a-col :span="5" style="position:relative;">
      <a-avatar class="mt-3 ml-3" :size="50" :src="displayUserInfo.avatar"></a-avatar>
      <a-tooltip v-if="displayUserInfo.certification && displayUserInfo.certification.length>0"
                 :title="displayUserInfo.certification[0].name">
        <a-avatar style="position: absolute;width: 20px;height:20px;right: -15px;bottom: 0;z-index: 999;"
                  :src="displayUserInfo.certification[0].attestation_icon"></a-avatar>
      </a-tooltip>
    </a-col>
    <a-col :span="19">
      <div class="mt-3 mb-1 ml-2 font-bold truncate"> {{ displayUserInfo.nickname }}
      </div>
      <div>
        <div class="rounded-md ml-2 px-2 bg-mask inline-block font-bold" style="background: var(--primary-bg);">UID: {{ uid }}</div>
      </div>
    </a-col>
  </a-row>
  <div class="bg-mask rounded-lg p-3 m-3 mt-2 mb-0 " style="min-height: 24px;background: var(--primary-bg);color:var(--primary-text);">
    个性签名：
    {{ displayUserInfo.signature || '暂无签名' }}
  </div>
  <div class="bg-mask rounded-lg p-3 m-3 mt-2 mb-0 " style="min-height: 77px;background: var(--primary-bg);color: var(--primary-text) ;">
    <OnlineGradeDisplay :key='key' :grade="grade.grade" :extra="grade"></OnlineGradeDisplay>
  </div>
  <div class=" mb-0 pd-0 m-3 p-3 mt-0" style="margin-bottom: 0;color: var(--primary-text);">
    成就勋章
  </div>
  <div class="bg-mask rounded-lg p-3 m-3 mt-0  mb-3" style="background: var(--primary-bg);color: var(--primary-text) ;">
    <OnlineMedal  v-if="grade.rank" :rank="grade.rank"></OnlineMedal>
    <Medal :medal="medal" v-for="medal in medals"></Medal>
  </div>
  <!--  <div class=" mb-0 pd-0 m-3 p-3 mt-0">-->
  <!--    小队信息-->
  <!--  </div>-->
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { teamStore } from '../../store/team'
import Medal from '../team/Medal.vue'
import OnlineMedal from '../team/OnlineMedal.vue'
import OnlineGradeDisplay from '../team/OnlineGradeDisplay.vue'
import { appStore } from '../../store'

export default {
  name: 'UserCard',
  components: { Medal, OnlineMedal, OnlineGradeDisplay },
  props: ['uid', 'visible', 'userInfo'],
  emits: ['visibleChanged'],
  data () {
    return {
      grade: {},
      medals: [],
      key: Date.now(),
    }
  },
  watch: {
    'uid': {
      async handler () {
        this.updateUserMedal()
        this.grade = await this.getMemberGrade(this.uid)
        this.key = Date.now()
      }
    }
  },
  computed: {
    ...mapState(appStore, ['userCardUserInfo']),
    displayUserInfo () {
      if (this.userInfo) {
        return this.userInfo
      } else {
        return {
          certification: []
        }
      }
    }
  },
  async mounted () {
    this.updateUserMedal()
    this.grade = await this.getMemberGrade(this.uid)
  },
  methods: {
    ...mapActions(teamStore, ['getMemberGrade', 'getUserMedal', 'getUserCard']),
    updateUserMedal(){
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

</style>
