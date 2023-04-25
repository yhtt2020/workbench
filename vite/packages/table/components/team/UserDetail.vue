<template>
  <a-row :gutter="20">
    <a-col :span="5">
      <a-avatar class="mt-3 ml-3" :size="50" :src="userInfo.avatar"></a-avatar>
    </a-col>
    <a-col :span="19">
      <div class="mt-3 mb-1 ml-2 font-bold truncate"> {{ userInfo.nickname }}</div>
      <div>
        <div class="rounded-md ml-2 px-2 bg-mask inline-block font-bold">UID: {{ userInfo.uid }}</div>
      </div>
    </a-col>
  </a-row>
  <div class="bg-mask rounded-xl p-3 m-3 mt-2 mb-0 " style="min-height: 77px">
    <OnlineGradeDisplay :key='key' :grade="grade.grade" :extra="grade"></OnlineGradeDisplay>
  </div>
  <div class=" mb-0 pd-0 m-3 p-3 mt-0" style="margin-bottom: 0;">
    成就勋章
  </div>
  <div class="bg-mask rounded-xl p-3 m-3 mt-0 text-center mb-0">

    <div>
      <OnlineMedal v-if="grade.rank" :rank="grade.rank"></OnlineMedal>
    </div>

  </div>
  <div class=" mb-0 pd-0 m-3 p-3 mt-0">
    小队贡献
  </div>
  <div class="bg-mask rounded-xl m-3 p-3 mt-0" style="line-height: 2">
<!--    升级效率：<strong>{{ effect }} %</strong>-->
    小队在线时长：<br>
    平均每日在线：1级<br>
    加入时间：-<br>
    下线时间：-<br>
    离被自动请离还有：1小时<br>
  </div>

</template>

<script>
import {mapActions} from 'pinia'
import { teamStore } from '../../store/team'
import OnlineGradeDisplay from './OnlineGradeDisplay.vue'
import OnlineMedal from './OnlineMedal.vue'

export default {
  name: 'UserDetail',
  components: { OnlineMedal, OnlineGradeDisplay },
  props:['userInfo'],
  data(){
    return{
      grade:{},
      key:''
    }
  },
  async mounted () {

    let rs=await  this.getMemberGrade(this.userInfo.uid)
    this.grade = rs
  },
  methods:{
    ...mapActions(teamStore,['getMemberGrade'])
  }
}
</script>

<style scoped>

</style>
