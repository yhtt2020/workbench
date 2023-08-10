<template>
  <Widget 
  :options="options" 
  :customData="customData"
  :desk="desk" 
  ref="eatSlot" 
  :menuList="menuList"
  >
  <div class="truncate" style="position: absolute;left: 45px;font-size: 16px;top:13px;color:var(--primary-text);width: 190px;">{{ title }}
  </div>
  <Turntable :eatList="eatList"></Turntable>
  </Widget>
  <a-drawer v-model:visible="openSettings" title="设置" placement="right" width="500">
    <div class="flex flex-col" style="color:var(--primary-text)">
      <span class="drawer-title" style="margin-bottom:24px;">名称</span>
      <a-input v-model:value="title" spellcheck ="false" class="input" placeholder="请输入" aria-placeholder="font-size: 16px;" style="height: 48px;"/>
      <span class="drawer-title" style="margin-top:24px;">选项</span>
      <span class="drawer-tip">每行填写一个选项</span>
      <a-textarea v-model:value="eatText" :bordered="false" spellcheck="false" class="input xt-text my-4" placeholder="请输入" aria-placeholder="font-size: 16px;" style="height: 423px;"/>
      
    </div>
  </a-drawer>
</template>

<script lang="ts">
import Widget from '../../card/Widget.vue'
import Turntable from './Turntable.vue'
import { mapActions, mapWritableState } from 'pinia'
export default {
  name: 'Todo',
  components: {
    Widget,
    Turntable,
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
      taskList: [],
      title: '今天吃什么',
      eatText: '',
      eatList: ['糯米饭','拉面','面包','苹果','牛排','烤鸭','炒饭','火锅'],
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
.drawer-title{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}
.drawer-tip{
    font-size: 16px;
    color: var(--secondary-text);
    margin: 8px 0 19px;
}
.input{
  height: 48px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  font-size: 16px;
  border: 1px solid rgba(255,255,255,0.2) !important;
}

</style>
