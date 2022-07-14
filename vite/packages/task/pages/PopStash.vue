<script lang="ts">
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
const path = eval('require')('path')
const fs = eval('require')('fs')
export default {
  components: {
  },
  data() {
    return {
      stTasks:[],
      callerId:0
    }
  },
  async mounted() {
    this.ipc = eval('require')('electron').ipcRenderer
    this.callerId=await this.ipc.invoke('getPopCallerId')
    this.ipc.on('gotStashTasks',(event,args)=>{
      console.log(args)
      let tasks=args.tasks
      this.stTasks=tasks.map(stTask=>{
        return Object.assign(stTask,{
          data:JSON.parse(stTask.taskData)
        })
      })
      console.log(this.stTasks)
    })
    this.ipc.sendTo(this.callerId,'getStashTasks')
  },
  methods: {

  }
}
</script>

<template>
<div v-for="task in stTasks">
  {{task.data.name || '标签组'}}
</div>
</template>
<style>
html, body {
  overflow: hidden !important;
}
</style>
<style scoped lang="scss">

</style>
