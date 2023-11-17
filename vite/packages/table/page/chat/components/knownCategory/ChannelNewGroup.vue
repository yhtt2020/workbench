<template>
  <div class="flex flex-col justify-between my-3" style="width: 650px; height: 530px;" v-if="nextShow === false">
    <ModalTop title="选择联系人" back="true" @close="closeContact" @back="backButton"/>
    <div class="flex  justify-between px-6">
      <div class="flex flex-col" style="width: 293px;">
        <div class="font-16 font-400 xt-font xt-text-2 mb-4">我的好友</div>
        <div class="flex items-center h-full justify-center xt-text" v-if="friendList.length === 0">
          <a-empty :image="simpleImage" />
        </div>
        <vue-custom-scrollbar :settings="settingsScroller" v-else style="height:428px;">
          <div v-for="(item,index) in friendList" :class="{ 'select-bg':isSelected(index) }" class="flex items-center pointer rounded-lg xt-text mb-2 p-3"  @click="selectUser(item)">
            <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
            <div class="font-16 xt-font font-400 xt-text ml-4">
              {{ item.profile.nick }}
            </div>
          </div>
        </vue-custom-scrollbar>
      </div>
      <a-divider type="vertical" style="height: 480px; border-color: var(--divider)"/>
      <div class="flex flex-col" style="width: 293px;">
        <div class="font-16 font-400  xt-text mb-4 xt-font">已选({{selectList.length}}人)</div>
        <vue-custom-scrollbar :settings="settingsScroller" style="height:380px; margin-bottom: 16px;">
          <div v-for="item in selectList" class="flex mb-2 p-3 xt-text justify-between">
            <div class="flex">
              <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
              <div class="font-16 font-400 xt-text ml-4 xt-font" >
                {{ item.profile.nick }}
              </div>
            </div>
            <xt-button w="20" h="20" class="category-button" @click="clearSelect(item)">
              <div class="flex items-center justify-center">
                <NewGroupIcon icon="fluent:subtract-circle-12-filled" class="xt-text" style="font-size: 1.25rem;"/>
              </div>
            </xt-button>
          </div>
        </vue-custom-scrollbar>
        <div class="flex justify-end">
          <xt-button w="64" h="40" class="category-button mr-3" @click="closeContact">取消</xt-button>
          <xt-button w="64" h="40" class="category-button" type="theme" @click="submitNext">确定</xt-button>
        </div>
      </div>
    </div>
  </div>
  <UnClassNext v-else :list="selectList" :no="no" :id="id" @backButton="nextShow = false" @close="closeContact"/>
</template>

<script>
import { storeToRefs } from 'pinia';
import { reactive,ref,toRefs,computed,onMounted } from 'vue';
import { appStore } from '../../../../store';
import { Icon as NewGroupIcon } from '@iconify/vue'
import _ from 'lodash-es';
import { message } from 'ant-design-vue'

import ModalTop from '../ModalTop.vue';
import UnClassNext from '../create/UnClassNext.vue';

export default {
  components:{
    NewGroupIcon,
    ModalTop,UnClassNext,
  },
  props:['no','id'],

  setup(props,ctx){
    const server = window.$TUIKit
    const apps = appStore()
    const { userInfo } = storeToRefs(apps)

    const data = reactive({
      friendList:[],  // 好友列表
      selectList:[], // 右侧选中列表
      simpleImage:'/img/state/null.png', // 空状态图片
      nextShow:false,
      settingsScroller: {  // 滚动条配置
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
    })

    const closeContact = () =>{ ctx.emit('close') }
    const backButton = () =>{ ctx.emit('back') }
    // 选中用户
    const selectUser = (item) =>{
     const index = _.findIndex(data.selectList,function(o){ return o.userID === item.userID})
     if(index === -1 ){
       data.selectList.push(item)
     }else{
      data.selectList.splice(index,1)
     }
    }
    // 清除选中用户
    const clearSelect = (item) => { 
     const index = _.findIndex(data.selectList,function(o){ return o.userID === item.userID})
     data.selectList.splice(index,1)
    }
    // 获取好友列表
    const getFriendList = async () =>{
      const res  = await server.tim.getFriendList();
      const resData = res.data
      const list = [];
      const uid = parseInt(userInfo.value.uid)
      for(const item of resData){
        if(parseInt(item.userID) !== uid){
          list.push(item)
        }
      }
      data.friendList = list
    }
    // 列表选中状态
    const isSelected = (index) =>{
      return data.selectList.includes(data.friendList[index])
    }
    //  创建群聊下一步
    const submitNext = (evt) => {
      if(data.selectList.length !== 0){
        data.nextShow = true
      }else{
        message.warning('需要选择用户')
        evt.preventDefault();
      }
    }

    onMounted(getFriendList)
    return{
      isSelected,
      ...toRefs(data),clearSelect,
      closeContact,backButton,selectUser,submitNext,
    }
  }
};
</script>

<style lang="scss" scoped>
.select-bg{
  background: var(--active-secondary-bg) !important;
  border:1px solid var(--active-bg) !important;
}

:deep(.ant-select-arrow){
  color: var(--primary-text) !important;
}
</style>