<template>
  <Widget 
  :options="options" 
  :sizeList="sizeList"
  :customData="customData"
  :desk="desk" 
  ref="todoSlot" 
  :menuList="toggleTodoList">
    <div class="xt-bg-2 rounded-lg px-3 py-1 pointer" @click="showDrawer"
      style="position: absolute;left: 45px;top:10px;background: var(--primary-bg);color:var(--primary-text)">{{ todoType[todoIndex].title }}
    </div>
    <div class="content-box" v-if="todoIndex === 0">
      <Tasklist :data="displayList"></Tasklist>
    </div>
  </Widget>
  <a-drawer v-model:visible="openSettings" title="设置" placement="right" width="500">
    <div class="flex flex-col" style="color:var(--primary-text)">
      <span   v-for="(item,index) in todoType" :key="index"  
      @click="getTodoType(item,index)" 
      :class="rankIndex === index ? 'active-index':''" 
      class="mb-4  text-center pointer change h-12 xt-bg-2 rounded-lg show-game-time py-3">
         {{ item.title }}
      </span>
    </div>
  </a-drawer>
</template>

<script>
import Widget from '../../card/Widget.vue'
import { mapActions, mapWritableState } from 'pinia'
import Tasklist from './TaskList.vue'
import { listStore } from '../../../page/app/todo/stores/list'
import { taskStore } from '../../../page/app/todo/stores/task'
export default {
  name: 'Todo',
  components: {
    Widget,
    Tasklist
  },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    desk:{
      type:Object
    }
  },
  data () {
    return {
      options: {className: 'card small',title: '',icon: 'check-square',type: 'todo'},
      sizeList:[{title:'1x1',height:1,width:1,name:'1x1'},{title:'1x2',height:2,width:1,name:'1x2'}],
      openSettings: false,
      toggleTodoList:[ { icon: 'shezhi1', title: '设置', fn: () => {this.openSettings = true;this.$refs.todoSlot.visible = false } } ],
      todoType: [
        {title:'个人',name:'total'},
        {title:'今天',name:'net'},
        {title:'七天',name:'team'}
      ],
      todoIndex: 0
    }
  },
  computed: {
    ...mapWritableState(taskStore, ["taskFilter","displayList"]),
    ...mapWritableState(listStore, ["activeList"]),
  },
  mounted() {
    console.log(this.taskFilter)
    console.log(this.activeList)
    if (this.customData?.id) {
      this.todoIndex = this.customData.id
    }
  },
  methods: {
    getTodoType(item,index){
      this.customData.id = index
      this.todoIndex = this.customData.id
      this.openSettings = false

      this.activeList = {};
      switch (index) {
        case 1:
          this.taskFilter = null;
          break;
        case 2:
          this.taskFilter = (task) => {
            if (!task.deadTime) return false;
            else {
              return task.deadTime - Date.now() / 1000 <= 86400;
            }
          };
          break;
        case 3:
          this.taskFilter = (task) => {
            if (!task.deadTime) return false;
            else {
              return task.deadTime - Date.now() / 1000 <= 604800;
            }
          };
          break;
      }
    },
    
  }
}
</script>

<style scoped lang="scss">
.content-box {
  height: calc(100% - 35px);
  margin-top: 10px;
  overflow: hidden;
}
</style>
