<script lang="ts">
import {CloseOutlined, CheckOutlined} from '@ant-design/icons-vue'
const ipc = eval('require')('electron').ipcRenderer
export default {
  components: {CloseOutlined, CheckOutlined},
  props: {
    list: Array,
    selectedKeys: Array
  },
  emits: ['update:selectedKeys'],
  data() {
    return {
      dataList: [],
      selectedKeysData: []
    }
  },
  computed: {
    dataList() {
      return this.list.map(task => {
        task.icon = this.getIcon(task.data.tabs[0].favicon)
        return task
      })
    }
  },
  mounted() {
  },
  methods: {
    getUserIconName(userIcon) {
      let iconPath = userIcon.split('.')
      return iconPath[2]
    },
    selected(task) {
      let index = this.selectedKeysData.indexOf(task.id)
      if (index > -1) {
        this.selectedKeysData.splice(index, 1)
      } else {
        this.selectedKeysData.push(task.id)
      }
      this.$emit('update:selectedKeys', this.selectedKeysData)
      console.log(this.selectedKeysData)
    },
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
          <a-card :class="{'selected':this.selectedKeysData.indexOf(task.id)>-1}" @click="selected(task)"
                  :bordered="false" class="task">
                <span slot="title" slot-scope="title">
                   <svg v-if="task.data.userIcon" class="icon task-icon" aria-hidden="true">
            <use v-bind:xlink:href="'#icon-'+getUserIconName(task.data.userIcon)"></use>
          </svg>
          <img v-else class="icon" :src="task.icon" onerror="this.src='/icons/default.svg'"/>
                  &nbsp; {{ task.data.name || '标签组' }}
                </span>
            <img class="single-avatar" v-if="task.data.partition !=='persist:webcontent'"  src="/public/icons/randomuser.svg">
            <div class="time">{{ new Date(task.createTime).toLocaleString() }}</div>
            <div style="border-top: 1px solid #f1f1f1"></div>
            <ul class="tabs" style="height: 220px; overflow-y: auto; margin-right: -10px">
              <li
                class="tab-title"
                v-for="(tab, Dindex) in task.data.tabs"
                :key="Dindex"
                @click="selectTab(task, tab, task.id, Dindex)"
              >
                <a-avatar shape="square" size="small" class="tab-icon" :src="getIcon(tab.favicon)"></a-avatar>
                {{
                  tab.title == '' ? '新标签' : tab.title
                }}
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

</style>
