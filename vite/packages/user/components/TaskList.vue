<script lang="ts">
import {CloseOutlined, CheckOutlined, DeleteOutlined} from '@ant-design/icons-vue'
import '../assets/task-list.css';
import vueCustomScrollbar from 'vue-custom-scrollbar/src/vue-scrollbar.vue'
const ipc = eval('require')('electron').ipcRenderer

export default {
  components: {vueCustomScrollbar,CloseOutlined, CheckOutlined, DeleteOutlined},
  props: {
    list: Array,
    selectedKeys: Array,
    config: Object
  },
  emits: ['update:selectedKeys','remove'],
  data() {
    return {
      selectedKeysData: [],
      settings: {
        swipeEasing:true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  computed: {
    dataList() {
      return this.list.map(task => {
        task.icon = this.getIcon(task.tabs[0].favicon)
        return task
      })
    }
  },
  mounted() {
    this.ipc = eval('require')('electron').ipcRenderer
  },
  methods: {
    getTabName(tab){
     let title= tab.title == '' ? '新标签' : tab.title
      if(tab.newName){
        title=`<span style="color:#2181ff;font-weight: bold">${tab.newName}</span>`+"|"+`<span style="color: grey">${title}</span>`
      }else{
        title=`<span style="">${title}</span>`
      }
      return title
    },
    remove(id){
      this.$emit('remove',id)
    },
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
  <div >
    <div >
      <a-row :gutter="16">
        <a-col  :sm="12" :lg="8"  :xl="6" :xxl="4" v-for="(task,index) in dataList" :key="index">
          <a-card
                  :bordered="false" class="task">
            <div  slot="title" slot-scope="title">
              <div class="task-title" style="position: relative">
                <svg v-if="task.userIcon" class="icon task-icon" aria-hidden="true">
                  <use v-bind:xlink:href="'#icon-'+getUserIconName(task.userIcon)"></use>
                </svg>
                <img v-else class="icon" :src="task.icon" onerror="this.src='/icons/default.svg'"/>
                &nbsp; {{ task.name || '标签组' }}

                <img class="single-avatar" v-if="task.partition !=='persist:webcontent'"
                     src="/public/icons/randomuser.svg">
              </div>
            </div>
            <vue-custom-scrollbar :settings="settings" style="position:relative;height: 250px ;margin-right: -10px" >
            <ul class="tabs">
              <li
                class="tab-title"
                v-for="(tab, Dindex) in task.tabs"
                :key="Dindex"
                @click="selectTab(task, tab, task.id, Dindex)"
              >
                <a-avatar shape="square" size="small" class="tab-icon" :src="getIcon(tab.favicon)"></a-avatar>
               <span v-html="getTabName(tab)"></span>
              </li>
            </ul>
            </vue-custom-scrollbar>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<style>
.ant-card-body{
  padding:10px !important;
}
</style>
<style scoped lang="scss">

</style>
