<script lang="ts">
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import '../assets/task-list.css';
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
      callerId:0,
      selectedKeys:[]
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
    importTasks(){
      this.ipc.send('importTasks',{ids:JSON.parse(JSON.stringify(this.selectedKeys))})
      this.ipc.send('closeSelf')
    },
    getTasks(){
      this.ipc.sendTo(this.callerId,'getStashTasks')
    }
  }
}
</script>

<template>
  <div style="display: flex;flex-direction: column;height: 100vh">
    <div style="flex-grow:1;overflow-y: auto;background: #ccc">
      <TaskList :list="stTasks"  v-model:selectedKeys="selectedKeys"/>
    </div>
    <div class="bottom-bar" @click="importTasks"><a-button type="primary" :disabled="!selectedKeys.length>0">导入</a-button></div>

  </div>

</template>
<style>
html, body {
  overflow: hidden !important;
}
</style>
<style scoped lang="scss">

</style>
