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
        <div class="flex">
          <div class="head"></div>
          <div class="content" style="margin-left: 15px;width: 190px;height: 70px;">
            <span style="color: #f3f3f3;font-size: 15px;">在线等级：xx级</span>
            <div style="margin-top: 10px">
              <a-progress strokeColor="#ffffff" trailColor="#4d4d4d" :percent="30" :showInfo="false" />
            </div>
          </div>
          <div class="upgrade flex flex-direction" style="width: 130px;height: 70px;margin-left: 20px">
            <div style="color: #afaf61;margin-bottom: 10px">正在加速成长</div>
            <span style="color: #f3f3f3">xx小时xx分后升级</span>
          </div>
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

export default defineComponent({
  components: {
    Cache,
    InternalStorage,
    Achievement,
    Task,
    Team
  }
})
</script>

<style scoped lang="scss">

.rank{
  width: 380px;
  height: 75px;
  margin-left: 10px;
  .head{
    width: 60px;
    height: 60px;
    margin-left: 10px;
    border-radius: 50%;
    background-color: #5586F8;
  }
  .button{
    .work{
      width: 75px;
      height: 30px;
      background-color: #F5F5F5;
      border-radius: 6px;
      margin-left: 75px;
      text-align: center;
      line-height: 30px;
    }
    .play{
      margin-left: 10px;
      width: 75px;
      height: 30px;
      border: 1px solid #F5F5F5;
      border-radius: 6px;
      text-align: center;
      line-height: 30px;
      color: #F5F5F5;
    }
  }

}

</style>
