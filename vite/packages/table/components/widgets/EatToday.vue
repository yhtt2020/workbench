<template>
  <Widget 
  :options="options" 
  :customData="customData"
  :desk="desk" 
  ref="eatSlot" 
  :menuList="menuList"
  >
    <div>今天吃什么</div>
  </Widget>
  <a-drawer v-model:visible="openSettings" title="设置" placement="right" width="500">
    <!-- <div class="flex flex-col" style="color:var(--primary-text)">
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
    </div> -->
  </a-drawer>
</template>

<script lang="ts">
import Widget from '../card/Widget.vue'
import { mapActions, mapWritableState } from 'pinia'
export default {
  name: 'Todo',
  components: {
    Widget,
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
      options: {className: 'card',title: '',icon: 'zhuanpanshezhi',type: 'todo'},
      openSettings: false,
      menuList:[ { icon: 'shezhi1', title: '设置', fn: () => {this.openSettings = true;this.$refs.eatSlot.visible = false } } ],
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
    
  },
  mounted() {
    

  },
  methods: {
    
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
