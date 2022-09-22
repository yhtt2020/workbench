<template>
  <div class="main" >
    <div class="box-title flex justify-start align-center">
      <dashboard-outlined  class="box-icon" /> <span class="text-title" style="margin-left: 10px">内存 {{total}} GB</span>
    </div>
    <div class="box-content content-small flex flex-direction">
      <div class="flex justify-between" >
        <span class="text-content-w">已用: {{usage}} GB</span>
        <span class="text-content-w">剩余: {{free}} GB</span>
      </div>
      <div>
        <a-progress strokeColor="#f59923" trailColor="#4d4d4d" :percent="percentage" :showInfo="false" />
      </div>
      <div class="flex">
        <span class="text-content-b">共打开: {{pageCount}}个网页</span> &nbsp;
        <span class="text-content-b">{{appCount}}个应用</span>
      </div>
      <div style="text-align: right">
        <span class="text-button" size="small" @click="release()" style="font-size: 12px;"><rocket-outlined /> 释放</span>
      </div>
    </div>
  </div>
</template>

<script>
import {DashboardOutlined,RocketOutlined} from '@ant-design/icons-vue'
import {defineComponent} from "vue";
export default defineComponent({
  components:{
    DashboardOutlined,
    RocketOutlined
  },
  data(){
    return{
      usage:'',
      free:'',
      total:'',
      percentage:'',
      pageCount:'',
      appCount:''
    }
  },
  methods:{
    release(){
      ipc.send('toolbar.speedup')
    }
  },
mounted() {
  ipc.on('getMemory', (event, args) => {
      this.usage = (args.mem.mem.usedMemMb / 1024).toFixed(1)
      this.total = (args.mem.mem.totalMemMb / 1024).toFixed(1)
      this.free = (args.mem.mem.freeMemMb / 1024).toFixed(1)
      this.percentage = args.mem.mem.usedMemPercentage
      this.pageCount = args.pageCount
      this.appCount = args.appCount
  })
  },
})


</script>

<style>

</style>
