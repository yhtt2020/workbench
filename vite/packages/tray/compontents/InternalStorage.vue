<template>
  <div class="main" >
    <div class="title flex justify-start align-center">
      <span class="text-title" style="margin-left: 10px">内存 {{total}} GB</span>
    </div>
    <div class="content-small flex flex-direction">
      <div class="flex justify-between" style="width: 80%;margin-left: 15px;margin-top: 5px">
        <span class="text-content-w">占用: {{usage}} GB</span>
        <span class="text-content-w">剩余: {{free}} GB</span>
      </div>
      <div style="width: 80%;margin-left: 15px">
        <a-progress strokeColor="#f59923" trailColor="#4d4d4d" :percent="percentage" :showInfo="false" />
      </div>
      <span class="text-content-b" style="margin-left: 15px">共打开：xx 网页 xx 应用</span>
      <span @click="release()" style="font-size: 14px;margin-left: 140px;color: #d9d9d9;cursor:pointer;">释放</span>
    </div>
  </div>
</template>

<script>
let { ipcMain } = require('electron')
let { ipcRenderer } = require('electron')
import {defineComponent} from "vue";
var osu=require('node-os-utils')
export default defineComponent({
  data(){
    return{
      usage:'',
      free:'',
      total:'',
      percentage:''
    }
  },
  methods:{
    release(){
      ipcRenderer.send('release')
    }
  },
  async mounted() {
    let mem = await osu.mem.info()
    let info = {
      mem: mem,
    }
    this.usage = (mem.usedMemMb / 1024).toFixed(1)
    this.total = (mem.totalMemMb / 1024).toFixed(1)
    this.free = (mem.freeMemMb / 1024).toFixed(1)
    this.percentage = mem.usedMemPercentage
    console.log(info)
  },
})


//
// let mem=await osu.mem.info()
// let info={
//   mem: mem,
// }
// this.memoryUsage = Math.floor(mem.usedMemMb/1024)
// console.log(this.memoryUsage)
// },
</script>

<style>

</style>
