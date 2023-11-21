<template>
  <div class="flex flex-col my-3" style="width: 650px" v-if="next === false">
   <ModalTop title="选择联系人" back="true" @close="closeButton" @back="backButton"/>
    <!-- 中间内容 左侧 右侧 -->
    <div class="flex  justify-between px-6">
      <div style="width: 293px;height:440px;" class="flex flex-col">
        <div class="flex justify-between">
          <span class="font-16 font-400 xt-text-2 mb-4">我的好友</span>
          <a-checkbox v-model:checked="allChecked">全选</a-checkbox>
        </div>

        <div class="flex items-center  justify-center xt-text mt-10"  v-if="friendList.length === 0">
          <a-empty :image="simpleImage" />
        </div>
        <vue-custom-scrollbar :settings="settingsScroller" style="height:430px;">
          <div v-for="(item,index) in friendList" :class="{ 'select-bg':isSelected(index) }"
            class="flex items-center pointer rounded-lg xt-text mb-2 p-3" @click="selectUser(item)"
          >
           <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
           <div class="font-16 xt-text ml-4 xt-font font-400" > {{ item.profile.nick }} </div>
          </div>
        </vue-custom-scrollbar>
      </div>
      <a-divider type="vertical" style="height: 430px; border-color: var(--divider)"/>
      <div style="width: 293px;height: 430px;" class="flex flex-col">
        <div class="xt-text mb-4 shrink-0">已选({{selectList.length}}人)</div>
        <vue-custom-scrollbar :settings="settingsScroller" class="grow" style="height:350px; margin-bottom: 16px;">
          <div v-for="item in selectList" class="flex  justify-between p-3 mb-2 xt-text">
            <div class="flex">
              <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
              <div class="font-16 xt-text ml-4 xt-font font-400" > {{ item.profile.nick }} </div>
            </div>
            <xt-button w="20" h="20" class="category-button" @click="clearSelect(item)">
              <div class="flex items-center justify-center">
                <CreateIcon icon="fluent:subtract-circle-12-filled"/>
              </div>
            </xt-button>
          </div>
        </vue-custom-scrollbar>
        <div class="flex items-center justify-end">
          <xt-button w="64" h="40" class="mr-3 category-button" @close="closeButton">取消</xt-button>
          <xt-button w="64" h="40" class="category-button" type="theme" @click="submitNext">确定</xt-button>
        </div>
      </div>
    </div>
  </div>
  <CreateGroupNext v-else :list="selectList" :no="no" @backNext="next = false" @close="closeButton"/>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { message } from 'ant-design-vue';
import { appStore } from '../../../../store';
import { Icon as CreateIcon } from '@iconify/vue'
import _ from 'lodash-es'

import ModalTop from '../ModalTop.vue';
import CreateGroupNext from './CreateGroupNext.vue';

export default {
 components:{
  ModalTop,CreateIcon,CreateGroupNext,
 },

 props:['no'],

 data(){
  return{
    friendList:[],  // 好友列表
    selectList:[], // 右侧选中列表
    simpleImage:'/img/state/null.png', // 空状态图片
    allChecked:false, // 全选
    next:false,
    // 滚动条配置
    settingsScroller: {  
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true
    },
  }
 },

 computed:{
  ...mapWritableState(appStore,['userInfo'])
 },

 mounted(){
  this.$nextTick(()=>{
    this.getFriendList()
  })
 },

 methods:{
  // 获取列表
  async getFriendList(){
    const res  = await window.$TUIKit.tim.getFriendList()
    const getList = res.data;
    const list = [];
    const uid = this.userInfo.uid
    for(const item of getList){
      if(parseInt(item.userID) !== uid){
        list.push(item)
      }
    }
    this.friendList = list
  },
  // 选中状态
  isSelected(index){
    return this.selectList.includes(this.friendList[index])
  },
  // 关闭
  closeButton(){
    this.$emit('close')
  },
  // 返回
  backButton(){
    this.$emit('backButton')
  },
  // 选择用户
  selectUser(item){
    const index = _.findIndex(this.selectList,function(o){ return o.userID === item.userID})
    if(index === -1 ){
      this.selectList.push(item)
    }else{
      this.selectList.splice(index,1)
    }
  },
  // 清除选中用户
  clearSelect(item){
    const index = _.findIndex(this.selectList,function(o){ return o.userID === item.userID})
    this.selectList.splice(index,1)
  },
  // 下一步
  submitNext(){
    this.next = true
  }
 },

 watch:{
  'allChecked':{
    handler(newVal){
      if(newVal){
        this.selectList = this.friendList
      }else{
        this.selectList = []
      }
    },
    immediate:true,
  }
 }
}
</script>

<style lang="scss" scoped>
.select-bg{
  background: var(--active-secondary-bg) !important;
  border:1px solid var(--active-bg) !important;
}
</style>