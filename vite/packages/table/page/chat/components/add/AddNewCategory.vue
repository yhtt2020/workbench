<template>
 <teleport to="body">
  <Modal v-model:visible="addVisible" v-if="addVisible" :blurFlag="true" style="z-index:200 !important;">
    <div class="flex flex-col my-3 justify-between" style="width: 500px ;" v-if="nextShow === false">
     <ModalTop title="添加新应用" @close="addVisible = false"/>
     <div class="flex flex-col px-6">
      <div class="p-4 flex rounded-lg flex-col xt-bg-2">
       <span class="font-16 font-400 mb-2.5 xt-text" >选择类型</span>
       <span class="font-14 font-400 xt-text-2">
        你可以选择添加桌面，关联工作台内部的社区，也可以选择关联你的群聊，还支持自定义添加网页应用链接，把需要的资源全部整合到社群当中，与你的小伙伴们一起分享和协作。
       </span>
      </div>

      <div class="flex flex-col mt-4">
       <div v-for="item in channelList" class="flex items-center pointer rounded-lg px-6 py-5 mb-4"
        style="background: var(--secondary-bg);" :class="{'select-bg':selectIndex === item.type}" @click="selectChannel(item)">
        <NewIcon :icon="item.icon" style="font-size: 2.5em;"></NewIcon>
        <span class="pl-4 font-16 font-400 xt-text">{{ item.name }}</span>
       </div>
      </div>

      <div class="flex items-center justify-end">
        <xt-button w="64" h="40" class="category-button mr-3" @click="addVisible = false">取消</xt-button>
        <xt-button  w="64" h="40" class="category-button" type="theme" @click="selectSubmit">选择</xt-button>
      </div>
     </div>
    </div>
    <ChannelWebLink v-if="selectIndex === 'link' && nextShow === true " :no="no" @close="addVisible = false" @back="nextShow = false"/>
    <ChannelCommunity v-if="selectIndex === 'com' && nextShow === true" :no="no" @close="addVisible = false" @back="nextShow = false"/>
    <ChannelKnownGroup v-if="selectIndex === 'chat' && nextShow === true" :no="no" @close="addVisible = false" @back="nextShow = false" />
  </Modal>
 </teleport>
</template>

<script>
import { Icon as NewIcon } from '@iconify/vue'

import Modal from '../../../../components/Modal.vue';
import ModalTop from '../ModalTop.vue';
import ChannelWebLink from '../channelSelect/ChannelWebLink.vue';
import ChannelCommunity from '../channelSelect/ChannelCommunity.vue';
import ChannelKnownGroup from '../channelSelect/ChannelGroupChat.vue';

export default {
 components:{
  NewIcon,Modal,ModalTop,ChannelWebLink,
  ChannelCommunity,ChannelKnownGroup
 },

 props:['no'],

 data(){
  return{
   addVisible:false,
   channelList:[
    // { icon:'fluent-emoji-flat:desktop-computer',name:'桌面',type:'desk'},
    { icon:'fluent-emoji-flat:placard',name:'社区',type:'com' },
    { icon:'fluent-emoji-flat:thought-balloon',name:'群聊',type:'chat' },
    { icon:'fluent-emoji-flat:globe-with-meridians',name:'网页链接',type:'link' }
   ],

   selectIndex:'community',

   nextShow:false, // 选择完第一步的是否进入第二步

   type:'',
  }
 },

 methods:{
  openAddNewCategory(){
   this.addVisible = true
  },
  // 选择频道
  selectChannel(item){
   this.selectIndex = item.type
   this.type = item.type
  },
  // 选择完进入下一步
  selectSubmit(){
   this.nextShow = true
  }

 }



};
</script>

<style lang="scss" scoped>
.select-bg{
  background: var(--active-secondary-bg) !important;
  border:1px solid var(--active-bg) !important;
}
</style>