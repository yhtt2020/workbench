<template>
  <div class="flex flex-col mb-3" style="padding: 12px; width: 650px; height: 530px;" v-if="isNextShow === false">
    <ModalTop title="选择联系人" @close="closeContact"/>
    <!-- 中间内容 左侧 右侧 -->
    <div class="flex  justify-between">
      <div class="flex flex-col" style="width: 293px;">
        <div class="font-16" style="color: var(--secondary-text);padding-left: 12px;margin-bottom: 16px;">我的好友</div>
        <div class="flex items-center  justify-center" style="color: var(--primary-text);margin-top: 50px;" v-if="friendList.length === 0">
          <a-empty :image="simpleImage" />
        </div>
        <vue-custom-scrollbar :settings="settingsScroller" style="height:400px;">
          <div v-for="(item,index) in friendList" :class="{ 'select-bg':isSelected(index) }" class="flex items-center pointer rounded-lg" style="margin-bottom: 8px;padding: 12px;color: var(--primary-text);"  @click="selectUser(item)">
            <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
            <div class="font-16" style="color: var(--primary-text);margin-left: 16px;">
              {{ item.profile.nick }}
            </div>
          </div>
        </vue-custom-scrollbar>
      </div>

      <a-divider type="vertical" style="height: 460px; border-color: var(--divider)"/>

      <div class="flex flex-col" style="width: 293px;">
        <div style="color: var(--primary-text);margin-bottom: 16px;">已选({{selectList.length}}人)</div>
        
        <vue-custom-scrollbar :settings="settingsScroller" style="height:365px; margin-bottom: 16px;">
          <div v-for="item in selectList" class="flex  justify-between" style="margin-bottom: 8px;padding: 12px;color: var(--primary-text);">
            <div class="flex">
              <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
              <div class="font-16" style="color: var(--primary-text);margin-left: 16px;">
               {{ item.profile.nick }}
              </div>
            </div>
            <div class="pointer" @click="clearSelect(item)">
              <CloseIcon icon="zondicons:minus-solid" style="color: var(--disable-text);width: 20px;height: 20px;"/>
            </div>
          </div>
        </vue-custom-scrollbar>

        <div class="flex justify-end items-center">
          <xt-button w="100" h="40"  class="category-button mr-3" @click="closeContact">取消</xt-button>
          <xt-button w="100" h="40" type="theme" class="category-button" @click="enterNextStep">确定</xt-button>
        </div>
      </div>
    </div>
  </div>

  <CreateChatGroup v-else :list="selectList" @back="isNextShow = false" @close="closeContact"></CreateChatGroup>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import {Icon as CloseIcon} from '@iconify/vue'
import { appStore } from '../../../../store'
import _ from 'lodash-es'
import { message } from 'ant-design-vue'

import CreateChatGroup from './CreateChatGroup.vue'
import ModalTop from '../../../../page/chat/components/ModalTop.vue'

export default {
  components:{
    CreateChatGroup,
    CloseIcon,ModalTop,
  },

  props:['showBack'],

  data(){
    return{
      friendList:[],  // 好友列表
      selectList:[], // 右侧选中列表
      server:window.$TUIKit,
      isNextShow:false,
      simpleImage:'/img/state/null.png', // 空状态图片
      settingsScroller: {  // 滚动条配置 
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

  async mounted(){
    await this.getFriendList()
  },

  methods:{
    // 获取好友数据
    async getFriendList(){
      const res  = await this.server.tim.getFriendList()
      const list = [];
      for(let i =0; i<res.data.length;i++){
        if(parseInt(res.data[i].userID) !== this.userInfo.uid){
          list.push(res.data[i])
        }
      }
      this.friendList = list
    },

    // 关闭
    closeContact(){
      this.$emit('close')
    },

    // 返回
    backButton(){
      this.$emit('back')
    },
    
    // 选中状态
    isSelected(index){
      return this.selectList.includes(this.friendList[index])
    },

    // 点击当前选中
    selectUser(item){
      const index = _.findIndex(this.selectList,function(o){ return o.userID === item.userID})
      if(index === -1 ){
        this.selectList.push(item)
      }else{
        this.selectList.splice(index,1)
      }
    },

    // 清除已选中用户
    clearSelect(item){
      const index = _.findIndex(this.selectList,function(o){ return o.userID === item.userID})
      this.selectList.splice(index,1)
    },

    // 选择下一步
    enterNextStep(evt){
      if(this.selectList.length !== 0){
        this.isNextShow = true
      }else{
        message.warn('您还没有选择用户')
        evt.preventDefault();
        this.isNextShow = false
      }
    }


  }
}
</script>

<style lang="scss" scoped>
.close-button{
  position: absolute;
  top: 1px;
  right: 12px;
}
.select-bg{
  background: var(--active-secondary-bg) !important;
  border:1px solid var(--active-bg) !important;
}
</style>