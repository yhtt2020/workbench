<template>
  <Widget 
  :options="options" 
  :sizeList="sizeList"
  :customData="customData"
  :desk="desk" 
  ref="todoSlot" 
  :menuList="toggleTodoList"
  >
    <div style="height:100%;">
      <div @click="todoPage" class="pointer" style="position: absolute;left: 12px;top:12px;">
        <Icon icon="check-square" style="color:var(--secondary-text);font-size:24px"></Icon>
      </div>
      <div class="xt-bg-2 rounded-lg px-3 py-1 pointer" @click.stop="showDrawer"
        style="position: absolute;left: 45px;top:10px;background: var(--primary-bg);color:var(--primary-text)">{{ selectTodo.title }}
      </div>
      <div class="content-box">
        <Tasklist :data="notFinish"></Tasklist>
      </div>
    </div>
  </Widget>
  <a-drawer v-model:visible="openSettings" title="设置" placement="right" width="500">
    <div class="flex flex-col" style="color:var(--primary-text)">
      <span class="drawer-title" style="margin-top:0;">类型</span>
      <span   v-for="(item,index) in todoType" :key="index"  
      @click.stop="getTodoType(item)" 
      :class="selectTodo.nanoid === item.nanoid ? 'active-index':''" 
      class="mb-4  text-center pointer change h-12 xt-bg-2 rounded-lg show-game-time py-3">
         {{ item.title }}
      </span>
      <span class="drawer-title">清单</span>
      <span   v-for="(item,index) in listType" :key="index"  
      @click.stop="getTodoType(item,index)" 
      :class="selectTodo.nanoid === item.nanoid ? 'active-index':''" 
      class="mb-4  text-center pointer change h-12 xt-bg-2 rounded-lg show-game-time py-3">
         {{ item.title }}
      </span>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import Widget from '../../card/Widget.vue'
import { mapActions, mapWritableState } from 'pinia'
import Tasklist from './TaskList.vue'
import { databaseStore, listStore, taskStore } from "../../../page/app/todo/store";
export default {
  name: 'Todo',
  components: {
    Widget,
    Tasklist,
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
    },
  },
  data () {
    return {
      // options: {className: 'card small',title: '',icon: 'check-square',type: 'todo'},
      options: {className: 'card small',title: '',type: 'todo'},
      sizeList:[{title:'1x1',height:1,width:1,name:'1x1'},{title:'1x2',height:2,width:1,name:'1x2'}],
      openSettings: false,
      toggleTodoList:[ { icon: 'shezhi1', title: '设置', fn: () => {this.openSettings = true;this.$refs.todoSlot.visible = false } } ],
      todoType: [
        {title:'个人',nanoid: 'T00111'},
        {title:'今天',nanoid: 'T00222'},
        {title:'七天',nanoid: 'T00333'}
      ],
      // 清单
      listType: [],
      todoIndex: 0,
      selectTodo: {title:'个人',nanoid: 'T00111'},
      taskList: []
    }
  },
  computed: {
    ...mapWritableState(taskStore, ["taskFilter","displayList",'tasks']),
    ...mapWritableState(listStore, ["activeList","lists"]),
    notFinish(){
      return this.taskList.filter(item => !item.completed)
    }
  },
  async mounted() {
    //初始化数据
    await databaseStore().init();
    databaseStore().$subscribe(() => {
      databaseStore().save();
    });
    // if (this.customData?.id) {
    //   this.todoIndex = this.customData.id
    // }
    if (this.customData?.currentTodo) {
      this.selectTodo = this.customData.currentTodo
    }
    this.listType = this.lists?.map((item,index) => {
      return Object.assign({},{'title':item.title,'nanoid':item.nanoid})
    })
    if(!this.listType.length) this.selectTodo = {title:'个人',nanoid: 'T00111'}
    this.getTodoType(this.selectTodo)

  },
  methods: {
    showDrawer(){
      this.openSettings = true
      this.$refs.todoSlot.visible = false
    },
    getTodoType(item,index){
      this.customData.currentTodo = item
      this.selectTodo = item
      // this.customData.id = index
      // this.todoIndex = this.customData.id
      this.openSettings = false
      switch (item.nanoid) {
        case 'T00111':
          this.taskList = this.tasks
          break;
        case 'T00222':
          this.taskList = []
          break;
        case 'T00333':
          this.taskList = []
          break;
        default:
          this.taskList = this.tasks.filter(t => t.listNanoid[0] === item.nanoid)
          break; 
      }
    },
    todoPage(){
      this.$router.push({name: 'todo'})
    }
  }
}
</script>

<style scoped lang="scss">
.content-box {
  height: calc(100% - 35px);
  margin-top: 10px;
  overflow: hidden;
}
.active-index{
  background: var(--active-bg) !important;
}
.drawer-title{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: var(--primary-text);
  letter-spacing: 0;
  font-weight: 500;
  margin: 12px 0  24px;
}
</style>
