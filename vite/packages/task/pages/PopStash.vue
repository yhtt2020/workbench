<script lang="ts">
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import TaskList from '../components/TaskList.vue'

const path = eval('require')('path')
const fs = eval('require')('fs')
export default {
  components: {
    TaskList
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
      let tasks=args.tasks
      this.stTasks=tasks.map(stTask=>{
        return Object.assign(stTask,{
          data:JSON.parse(stTask.taskData)
        })
      })
    })
    this.getTasks()
    this.ipc.on('show',()=>{
      this.getTasks()
    })
  },
  methods: {
    getTasks(){
      this.ipc.sendTo(this.callerId,'getStashTasks')
    }
  }
}
</script>

<template>
  <div style="height: 100vh;overflow-y: auto;background: #ccc">
    <TaskList :list="stTasks" />
  </div>

</template>
<style>
html, body {
  overflow: hidden !important;
}
</style>
<style scoped lang="scss">

</style>
