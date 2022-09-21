<template>
  <div class="main" >
    <div class="title flex justify-start align-center">
      <span class="text-title" style="margin-left: 10px">内存 {{total}} GB</span>
    </div>
    <div class="content-small flex flex-direction">
      <div class="flex justify-between" style="width: 90%;margin-left: 10px;margin-top: 5px">
        <span class="text-content-w">占用: {{usage}} GB</span>
        <span class="text-content-w">剩余: {{free}} GB</span>
      </div>
      <div style="width: 90%;margin-left: 10px">
        <a-progress strokeColor="#f59923" trailColor="#4d4d4d" :percent="percentage" :showInfo="false" />
      </div>
      <div class="flex">
        <span class="text-content-b" style="margin-left: 15px">共打开: {{pageCount}}个网页</span>
        <span class="text-content-b" style="margin-left: 15px">{{appCount}}个应用</span>
      </div>
      <span @click="release()" style="font-size: 14px;margin-left: 138px;color: #d9d9d9;cursor:pointer;">释放</span>
    </div>
  </div>
</template>

<script>
let { ipcMain } = require('electron')
let { ipcRenderer } = require('electron')
import {defineComponent} from "vue";
// var osu=require('node-os-utils')
export default defineComponent({
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
      ipcRenderer.send('toolbar.speedup')
    }
  },
mounted() {
  ipcRenderer.on('getMemory', (event, args) => {
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
