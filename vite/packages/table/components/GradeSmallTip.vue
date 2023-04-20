<template>
  <div  class="grade-tip small-tip" style="background:#52C41A;" v-if="blocking">{{tipTitle}}</div>
  <div class="absolute inset-0" style="border-radius: 6px;background: rgba(42, 42, 42, 0.6);" @click.stop="clickTip" v-else>
    <div  class="grade-tip small-tip" style="color: rgba(255, 255, 255, 0.85);">{{tipTitle}}</div>
  </div>
  <a-modal v-model:visible="clickTipShow" :closable="false"  title="" @ok="()=>{}" :footer="null" style="font-size: 8px" :maskClosable="false" :centered="true">
    <div class="flex flex-col items-center rounded-xl h-44 w-96 justify-evenly text-sm text-white mx-auto" style="background: rgba(33, 33, 33, 1);">
      <div><Icon icon="-dengpao" style="font-size: 1.2em" class="mr-2"></Icon>提示</div>
      <div v-if="limitFlag">当前「 等级{{lv}} 」，已达当前等级上限</div>
      <div v-else-if="lastPowerType===''">当前「 等级{{lv}} 」，解锁{{powerAlias}}功能需要达到「 等级 {{powerLv}} 」</div>
      <div v-else>当前「 等级{{lv}} 」，解锁{{lastPowerType}}功能需要达到「 等级 {{powerLv}} 」</div>
      <div class="flex flex-row w-2/3  justify-between">
        <div class="rounded-xl w-28 h-10 flex justify-center items-center mt-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="goGrade">了解更多</div>
        <div class="rounded-xl w-28 h-10 flex justify-center items-center mt-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="closeTip">关闭</div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {leveList,powerList} from '../js/data/abilityData'
import {powerState} from '../js/watch/grade'
export default {
  name: "GradeSmallTip",
  data(){
    return{
      leveList,
      powerList,
      tipTitle:'',
      blocking:false,
      clickTipShow:false,
      lv:0,
      powerLv:0,
      powerAlias:'',
      superiorLimit:0,
      limitFlag:false
    }
  },
  props:{
    powerType:{
      type:String,
      default:''
    },
    lastPowerType:{
      type:String,
      default:''
    }
  },
  mounted() {
    this.lv = lv
    const {tipTitle,blocking,powerLv,powerAlias,superiorLimit}= this.powerState(this.powerType,lv,this.lastPowerType)
    this.tipTitle=tipTitle
    this.blocking=blocking
    this.powerLv=powerLv
    this.powerAlias=powerAlias
    this.superiorLimit=superiorLimit
  },
  methods:{
    powerState,
    clickTip(){
     this.clickTipShow=true
    },
    closeTip(){
      this.clickTipShow=false
    },
    goGrade(){
      this.closeTip()
      this.$emit('closeDrawer')
      this.$router.push({ name: 'grade'})
    }
  }
}
</script>

<style scoped>

</style>
