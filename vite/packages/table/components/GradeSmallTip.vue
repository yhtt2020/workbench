<template>
  <!-- <div class="grade-tip small-tip" style="background:#52C41A;" v-if="blocking">{{ tipTitle }}</div> -->
  <div v-if="! blocking" ref="tip" class="z-50">
    <div 
      v-if="limit"
      class="absolute inset-0 flex justify-center " 
      style="border-radius: 6px;" 
      @click.stop="clickTip" 
      >
      <div 
        class="grade-tip small-tip" 
        style="
          color: rgba(255, 255, 255, 0.85);
          background-color: #ea8236;
          font-weight: bold;">
            {{ tipTitle }} </div>
    </div>
    <!-- :style="{width: w + 'px', height: h + 'px'}" -->
    <div 
      @click.stop="clickTip"  
      :style="{width: w + 'px', height: h + 'px'}"
      class="absolute inset-0" 
      v-else>
      <div 
        class="absolute inset-0" 
        style="
          width: 30px; 
          height:25px !important;
          text-align: center;
          left: 125px;
          top: 50%;transform: translate(0, -50%);" >
          <div 
            style="background-color: #ea8236;font-weight: bold;" class="p-1 text-xs rounded-md ">{{ tipTitle }}</div>
      </div>
    </div>
      
  </div>
</template>

<script>
import { leveList, powerList } from '../js/data/abilityData'
import { powerState } from '../js/watch/grade'
import {appStore} from '../store'
import { mapActions,mapWritableState } from 'pinia'
export default {
  name: "GradeSmallTip",
  data() {
    return {
      leveList,
      powerList,
      tipTitle: '',
      blocking: false,
      clickTipShow: false,
      lv: 0,
      powerLv: 0,
      powerAlias: '',
      superiorLimit: 0,
      limitFlag: false
    }
  },
  props: {
    powerType: {
      type: String,
      default: ''
    },
    lastPowerType: {
      type: String,
      default: ''
    },
    limit: {
      type:Boolean,
      default:true
    },
    w:{
      type: Number,
    },
    h:{
      type: Number,
    },
    showAdd:{
      type: Boolean,
      default: false
    }
    
  },
  mounted() {
    this.lv = lv
    const { tipTitle, blocking, powerLv, powerAlias, superiorLimit } = this.powerState(this.powerType, lv, this.lastPowerType)
    this.tipTitle = tipTitle
    this.blocking = blocking
    this.powerLv = powerLv
    this.powerAlias = powerAlias
    this.superiorLimit = superiorLimit
  },
  methods: {
    powerState,
    clickTip() {
      this.clickTipShow = true
    },
    closeTip() {
      this.clickTipShow = false
    },
    goGrade() {
      this.closeTip()
      this.$emit('closeDrawer')
      this.$router.push({ name: 'grade' })
    },
    gradeTableGenerate (num) {
      let lvSys = {}
      for (let i = 0; i < num + 1; i++) {
        let arrLef = 0
        let arrRg = 0
        for (let j = 0; j < i; j++) {
          arrLef += 10 * (j + 2)
        }
        for (let k = 0; k < i + 1; k++) {
          arrRg += 10 * (k + 2)
        }
        arrRg -= 1
        lvSys[`${i}`] = [arrLef, arrRg]
      }
      delete lvSys['lv0']
      return lvSys
    },
    
  },
  computed: {
    ...mapWritableState(appStore, ['lvInfo','userInfo']),
  },
  watch: {
    // 弹出框显示
    clickTipShow(newV,oldV) {
      let goalLv = this.gradeTableGenerate(64)[this.powerLv]
      let target = goalLv[0] - this.userInfo?.onlineGradeExtra?.cumulativeHours || 20
      if(newV){
        window.$ui.confirm(
          `解锁该功能需要达到「${this.powerLv}」级`,
          `保持工作台登录在线，即可升级，距离解锁该功能还需要「${target}」小时`,
          
          {
            ok: () => {
              this.closeTip()
            },
            noText:false,
            okText:'OK',
            type: 'warning',
          },
          )
      }
    }
  }
}
</script>

<style scoped></style>
