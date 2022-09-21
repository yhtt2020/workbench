<template>
  <div class="header flex justify-between align-center" style="width: 100%;height: 32px">
    <span style="color:#f3f3f3;font-size: 14px;margin-left: 10px">快捷面板</span>
    <div hidden class="flex justify-between align-center" style="margin-right: 10px">
      <div
        style="width: 90px;height: 22px;border-radius: 6px;background-color: #4f4f4f;line-height: 22px;text-align: center;color: #f3f3f3">
        点击箭头切换
      </div>
      <left-outlined/>
      <right-outlined/>
    </div>
  </div>
  <div>
    <a-row type="flex" justify="space-around" align="top" :gutter="[0,16]">
      <a-col class="team" :span="23">
        <Team></Team>
      </a-col>
      <a-col class="task" :span="11">
        <Task></Task>
      </a-col>
      <a-col hidden class="achievement" :span="11">
        <Achievement></Achievement>
      </a-col>
      <a-col class="internalStorage" :span="11">
        <InternalStorage></InternalStorage>
      </a-col>
      <a-col hidden class="cache" :span="11">
        <Cache></Cache>
      </a-col>
      <a-col class="rank flex flex-direction" :span="23">
        <div class="flex">
          <div class="head">
            <a-avatar style="position: relative;cursor: pointer" :size="55"
                      :src="avatar">
            </a-avatar>
          </div>
          <div class="content" @click="goDetail('grade')" style="margin-left: 15px;width: 100%;height: 60px;margin-top: 5px">
            <span style="color: #f3f3f3;font-size: 14px;">在线等级：{{ lv }}级 &nbsp;&nbsp;
              <span  v-if="this.lv > 0">
                <span class="ts-grade-crown" v-for="item in onlineGrade.crown">
                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                </span>
                <span class="ts-grade-sun" v-for="item in onlineGrade.sun">
                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                </span>
                <span class="ts-grade-moon" v-for="item in onlineGrade.moon">
                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                </span>
                <span class="ts-grade-star" v-for="item in onlineGrade.star">
                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                </span>
              </span></span>
            <div class="flex" style="margin-top: 5px">
              <a-progress strokeColor="#ffffff" trailColor="#4d4d4d" :percent="percentage" :showInfo="false"
                          style="width: 165px"/>
              <span
                style="color: #f3f3f3;font-size: 14px;margin-left: 5px">{{ remainHour }}小时{{ remainMinute }}分后升级</span>
            </div>
          </div>
          <!--          <div class="upgrade flex flex-direction" style="width: 130px;height: 60px;margin-left: 15px;margin-top: 5px">-->
          <!--            <div  style="color: #afaf61;margin-bottom: 5px;margin-left: 15px">-->
          <!--              <thunderbolt-outlined />-->
          <!--              <span style="margin-left: 5px;font-size: 12px">正在加速成长</span>-->
          <!--            </div>-->
          <!--            <span style="color: #f3f3f3;font-size: 14px">{{remainHour}}小时{{remainMinute}}分后升级</span>-->
          <!--          </div>-->
        </div>
        <div hidden class="button flex">
          <div class="work">工作模式</div>
          <div class="play">娱乐模式</div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Team from '../compontents/Team.vue'
import Task from '../compontents/Task.vue'
import Achievement from '../compontents/Achievement.vue'
import Cache from '../compontents/Cache.vue'
import InternalStorage from '../compontents/InternalStorage.vue'

import {mapState} from 'vuex'
import { defineComponent } from 'vue'

import {
  ThunderboltOutlined, LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'

let { ipcMain } = require('electron')
let { ipcRenderer } = require('electron')

const osu = require('node-os-utils')

// let grade
// ipcRenderer.once('userInfo',(event,args)=>{
//   grade = args
//   console.log(grade)
// })

export default defineComponent({
  name: 'Home',
  components: {
    Cache,
    InternalStorage,
    Achievement,
    Task,
    Team,
    ThunderboltOutlined,
    LeftOutlined,
    RightOutlined
  },
  data () {
    return {
      lv: '',
      avatar: '',
      remainHour: '',
      remainMinute: '',
      minute: '',
      percentage: ''
    }
  },
  computed:{
    ...mapState(['onlineGrade'])
  },
  methods: {
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
    goDetail(path){
      this.$router.push({name:'detail',params: { path:path}})
    }
  },
  mounted () {
    ipcRenderer.on('userInfo', (event, args) => {
      this.$store.commit('setUser',args.data)
      this.lv = args.data.onlineGradeExtra.lv
      this.avatar = args.data.avatar
      let section = this.gradeTableGenerate(64)[this.lv + 1]
      let remain = section[0] * 60 - (args.data.onlineGradeExtra.minutes)
      this.remainHour = Math.floor(remain / 60)
      this.remainMinute = remain - (Math.floor(remain / 60) * 60)
      this.minute = args.data.onlineGradeExtra.minutes
      this.percentage = (this.minute / (section[0] * 60)) * 100
    })
    ipcRenderer.send('getMemory')
    ipcRenderer.send('getUserInfo')
    setInterval(()=>{
      ipcRenderer.send('getMemory')
    },2000)
    setInterval(()=>{
      ipcRenderer.send('getUserInfo')
    },60000)
  }
  // this.memoryUsage = await osu.mem.info()
})
</script>

<style scoped lang="scss">
.ts-grade-crown{
  display: inline-block;

}
.rank {
  width: 380px;
  height: 75px;
  margin-left: 10px;

  .head {
    //width: 60px;
    //height: 55px;
    margin-left: 10px;
    border-radius: 50%;
    //background-color: #5586F8;
  }

  .button {
    .work {
      width: 75px;
      height: 25px;
      background-color: #F5F5F5;
      border-radius: 6px;
      margin-left: 75px;
      text-align: center;
      line-height: 25px;
    }

    .play {
      margin-left: 10px;
      width: 75px;
      height: 25px;
      border: 1px solid #F5F5F5;
      border-radius: 6px;
      text-align: center;
      line-height: 25px;
      color: #F5F5F5;
    }
  }

}

</style>
