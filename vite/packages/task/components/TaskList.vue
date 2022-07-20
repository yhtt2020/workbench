<script lang="ts">
import {CloseOutlined,CheckOutlined} from '@ant-design/icons-vue'
const ipc = eval('require')('electron').ipcRenderer
export default {
  components: {CloseOutlined,CheckOutlined},
  props:{
    list:Array
  },
  data() {
    return {
      dataList:[]
    }
  },
  computed:{
    dataList(){
      return this.list.map(task=>{
        task.icon = this.getIcon(task.data.tabs[0].favicon)
        return task
      })
    }
  },
  mounted(){
  },
  methods: {
    //获取图标的方法
    getIcon(favicon) {
      var defaultIcon = '../../icons/empty.png'
      if (typeof favicon == 'undefined') {
        return defaultIcon
      } else if (favicon == null) {
        return defaultIcon
      } else {
        return favicon.url
      }
    },
  }
}
</script>

<template>
  <div style="padding-bottom:40px;height: 100%; overflow-y: auto">
    <div style="padding: 20px;height: 100%;">
      <a-row :gutter="16">
        <a-col :span="8" v-for="(task,index) in dataList" :key="index">
          <a-card :bordered="false" class="task">
                <span slot="title" slot-scope="title">
                  <a-avatar shape="square" size="small" :src="task.icon"></a-avatar> &nbsp; {{ task.data.name || '标签组'}}
                  <span>{{new Date(task.createTime).toLocaleString()}}</span>
                </span>
            <ul class="tabs" style="height: 220px; overflow-y: auto; margin-right: -10px">
              <li
                class="tab-title"
                v-for="(tab, Dindex) in task.data.tabs"
                :key="Dindex"
                @click="selectTab(task, tab, task.id, Dindex)"
              >
                <a-avatar shape="square" size="small" class="tab-icon" :src="getIcon(tab.favicon)"></a-avatar> {{
                  tab.title==''?'新标签':tab.title }}
              </li>
            </ul>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<style>

</style>
<style scoped lang="scss">
@import '../assets/task-list';
</style>
