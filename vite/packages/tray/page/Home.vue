<template>
    <a-row type="flex" justify="space-around" align="top"  :gutter="[0,16]">
      <a-col class="team" :span="23">
        <Team></Team>
      </a-col>
      <a-col class="task" :span="11">
        <Task></Task>
      </a-col>
      <a-col class="achievement" :span="11">
        <Achievement></Achievement>
      </a-col>
      <a-col class="internalStorage" :span="11" >
        <InternalStorage></InternalStorage>
      </a-col>
      <a-col class="cache" :span="11" >
        <Cache></Cache>
      </a-col>
      <a-col class="rank flex flex-direction" :span="23">
        <div class="flex" style="margin-top: 10px">
          <div class="head">
            <a-avatar style="position: relative;cursor: pointer" :size="60"
                      :src="avatar">
            </a-avatar>
          </div>
          <div class="content" style="margin-left: 15px;width: 100%;height: 60px;margin-top: 5px">
            <span style="color: #f3f3f3;font-size: 14px;">在线等级：{{lv}}级</span>
            <div class="flex" style="margin-top: 5px" >
              <a-progress strokeColor="#ffffff" trailColor="#4d4d4d" :percent="30" :showInfo="false" style="width: 180px" />
              <span style="color: #f3f3f3;font-size: 14px">{{remainHour}}小时{{remainMinute}}分后升级</span>
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
        <div class="button flex">
          <div class="work">工作模式</div>
          <div class="play">娱乐模式</div>
        </div>
      </a-col>
    </a-row>

</template>

<script>
import Team from '../compontents/Team.vue'
import Task from '../compontents/Task.vue'
import Achievement from '../compontents/Achievement.vue'
import Cache from '../compontents/Cache.vue'
import InternalStorage from '../compontents/InternalStorage.vue'
import {defineComponent} from 'vue'
import {
   ThunderboltOutlined
} from '@ant-design/icons-vue'

let { ipcMain } = require('electron')
let { ipcRenderer } = require('electron')

const osu=require('node-os-utils')

// let grade
// ipcRenderer.once('userInfo',(event,args)=>{
//   grade = args
//   console.log(grade)
// })


export default defineComponent({
  components: {
    Cache,
    InternalStorage,
    Achievement,
    Task,
    Team,
    ThunderboltOutlined
  },
  data(){
    return{
      lv:'',
      avatar:'',
      remainHour:'',
      remainMinute:'',
    }
  },
  methods:{
    gradeTableGenerate(num){
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
    }
  },
 mounted() {
   ipcRenderer.on('userInfo', (event, args) => {

     this.lv = args.data.onlineGradeExtra.lv
     this.avatar = args.data.avatar
     let section = this.gradeTableGenerate(64)[this.lv + 1]
     let remain = section[0] * 60 - (args.data.onlineGradeExtra.minutes)
     this.remainHour = Math.floor(remain / 60)
     this.remainMinute = remain - (Math.floor(remain / 60) * 60)
   })
 }
    // this.memoryUsage = await osu.mem.info()
})
</script>

<style scoped lang="scss">

.rank{
  width: 380px;
  height: 75px;
  margin-left: 10px;
  .head{
    //width: 60px;
    //height: 55px;
    margin-left: 10px;
    border-radius: 50%;
    //background-color: #5586F8;
  }
  .button{
    .work{
      width: 75px;
      height: 25px;
      background-color: #F5F5F5;
      border-radius: 6px;
      margin-left: 75px;
      text-align: center;
      line-height: 25px;
    }
    .play{
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
