<template>
  <Widget
  :options="options"
  :customData="customData"
  :desk="desk"
  ref="eatSlot"
  :menuList="menuList"
  >
  <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="fluent:emoji-smile-slight-24-regular" style="font-size: 20px;" />
        </div>
      </template>
  <div class="truncate" style="position: absolute;left: 45px;font-size: 16px;top:13px;color:var(--primary-text);width: 190px;">{{ title }}
  </div>
  <div @click="openSettings = true">
    <Turntable :eatList="eatList"></Turntable>
  </div>
  </Widget>
  <a-drawer v-model:visible="openSettings" title="设置" placement="right" width="500">
    <div class="flex flex-col" style="color:var(--primary-text)">
      <span class="drawer-title" style="margin-bottom:24px;">名称</span>
      <a-input v-model:value="title" spellcheck ="false" class="input" placeholder="请输入" aria-placeholder="font-size: 16px;" style="height: 48px;"/>
      <span class="drawer-title" style="margin-top:24px;">选项</span>
      <span class="drawer-tip">每行填写一个选项</span>
      <a-textarea @change="getEatVal" v-model:value="eatText" :bordered="false" spellcheck="false" class="my-4 input xt-text" placeholder="请输入" aria-placeholder="font-size: 16px;" style="height: 423px;"/>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import Widget from '../../card/Widget.vue'
import Turntable from './Turntable.vue'
import { mapActions, mapWritableState } from 'pinia'
import {message} from "ant-design-vue"
import { Icon as newIcon } from '@iconify/vue'
export default {
  name: 'Todo',
  components: {
    Widget,
    Turntable,
    newIcon
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
      options: {className: 'card',title: '',type: 'todo'},
      openSettings: false,
      menuList:[ { icon: 'shezhi1', title: '设置', fn: () => {this.openSettings = true;this.$refs.eatSlot.visible = false } } ],
      title: '今天吃什么',
      eatText: '',
      eatList: ['糯米饭','拉面','面包','苹果','牛排','烤鸭','炒饭','火锅'],
}
  },
  computed: {

  },
  mounted() {
    if(this.customData?.title){
      this.title = this.customData.title
    }
    if(this.customData?.eatList){
      this.eatList.splice(0,this.eatList.length,...this.customData.eatList)
    }
    this.eatList.map(item => this.eatText += item + "\n")
  },
  methods: {
    //设置富文本
    getEatVal(event){
        let eatVal = (event.target.value).split('\n').filter(item =>item)
        if(!eatVal.length){
          this.eatList.map(item => this.eatText += item + "\n")
          return message.info('至少保留一个')
        }

        eatVal.map((item,index) => {
          var judgeFn = new RegExp(/\s+/g);
          if (judgeFn.test(item)) {
            let arr = item.split(' ')
           eatVal.splice(index,1,arr[0])
          }
          if(item.indexOf(' ') !== -1){
           let arr = item.split(' ')
           item = arr[0]
          }
        })
        // let eatArr = [];
        // let flag = false;
        // for(let eat in eatVal){
        //   if(eatVal.length < this.eatList.length){
        //     // if(!this.eatList.find(item => item === eatVal[eat]))
        //   }
        //   if(eatVal.length >= this.eatList.length && eatVal[eat] !== this.eatList[eat]){
        //     this.eatList.splice(eat,1,eatVal[eat])
        //   }else if(eatVal.length < this.eatList.length){
        //      eatArr.push(this.eatList.find(item => item === eatVal[eat]))

        //      flag = true;
        //   }
        // }
        // console.log("剩余的值",eatArr)
        // if(this.eatArr || flag){
        //   if(!eatArr.length){
        //     this.eatList.splice(0,this.eatList.length)
        //   }
        //   // this.eatList.map((item,index) => {
        //   //   if(!eatArr.find(ead => item === ead)){
        //   //     this.eatList.splice(index,1)
        //   //   }
        //   // })
        //   for(let i = 0; i < this.eatList.length; i++){
        //     if(!eatArr.find(ead => this.eatList[i] === ead)){
        //       this.eatList.splice(i,1)
        //       i--;
        //     }
        //   }
        //   flag = false
        // }

        if(eatVal !== this.eatList){
          this.eatList.splice(0,this.eatList.length,...eatVal)
          this.customData.eatList = this.eatList
        }
    }
  },
  watch: {
    title(val){
      this.customData.title = val
    }
  }
}
</script>

<style scoped lang="scss">
.drawer-title{

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
