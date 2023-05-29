<template>
  <a-row :gutter="20">
    <a-col :span="5">
      <a-avatar class="mt-3 ml-3" :size="50" :src="userInfo.avatar"></a-avatar>
    </a-col>
    <a-col :span="19">
      <div class="mt-3 mb-1 ml-2 font-bold truncate"> {{ userInfo.nickname }}

      </div>
      <div>
        <div class="rounded-md ml-2 px-2 bg-mask inline-block font-bold">UID: {{ userInfo.uid }}</div>
      </div>
    </a-col>
  </a-row>
  <div class="bg-mask rounded-lg p-3 m-3 mt-2 mb-0 " style="min-height: 77px">
    <OnlineGradeDisplay :key='key' :grade="grade.grade" :extra="grade"></OnlineGradeDisplay>
  </div>
  <div class=" mb-0 pd-0 m-3 p-3 mt-0" style="margin-bottom: 0;">
    成就勋章
  </div>
  <div class="bg-mask rounded-lg p-3 m-3 mt-0  mb-0">
      <OnlineMedal v-if="grade.rank" :rank="grade.rank"></OnlineMedal>
      <Medal :medal="medal" v-for="medal in medals"></Medal>

  </div>
  <div class=" mb-0 pd-0 m-3 p-3 mt-0">
    小队贡献
  </div>
  <div class="bg-mask rounded-lg m-3 p-3 mt-0" style="line-height: 2">
<!--    升级效率：<strong>{{ effect }} %</strong>-->
<!--    小队在线时长：{{ online_h}} 小时 {{online_m}}分钟<br>-->
<!--    小队贡献：{{memberInfo.score}} 分<br>-->
<!--    平均每日在线：{{ daily_h }}小时{{daily_m}}分<br>-->
    加入时间：{{ memberInfo.updateTime }}<br>
    加入天数：{{joined_days}}天<br>
<!--    下线时间：-<br>-->
<!--    离被自动请离还有：1小时<br>-->
  </div>

</template>

<script>
import { mapActions } from 'pinia'
import { teamStore } from '../../store/team'
import OnlineGradeDisplay from './OnlineGradeDisplay.vue'
import OnlineMedal from './OnlineMedal.vue'
import Medal from './Medal.vue'
export default {
  name: 'UserDetail',
  components: { Medal, OnlineMedal, OnlineGradeDisplay },
  props:['userInfo','isLeader','memberInfo'],
  data(){
    return{
      grade:{},
      key:'',
      online_h:0,
      online_m:0,
      daily_minutes:0,
      daily_h:0,
      daily_m:0,
      joined_days:0,
      medals:[]
    }
  },
  async mounted () {
    this.getUserMedal(this.userInfo.uid).then(result=>{
      if(result){
        this.medals=result
      }else{
        this.medals=[]
      }
    })
    this.grade = await this.getMemberGrade(this.userInfo.uid)
    this.joined_days=Number(((new Date().getTime()-(new Date(this.memberInfo.updateTime).getTime()))/(24*60*60*1000)).toFixed(0))
    if(this.joined_days===0){
      //不足一天按1天计
      this.joined_days=1
    }
    this.daily_minutes=this.memberInfo.online_minutes/Number(this.joined_days).toFixed(0)
    this.online_h=(this.memberInfo.online_minutes/60).toFixed(0)
    this.online_m=(this.memberInfo.online_minutes%60).toLocaleString('us')
    this.daily_h=(this.daily_minutes/60).toFixed(0)
    this.daily_m=(this.daily_minutes%60).toFixed(0)
  },
  methods:{
    ...mapActions(teamStore,['getMemberGrade','getUserMedal'])
  },

}
</script>

<style scoped>

</style>
