<template>
 <teleport to='body'>
   <Modal v-if="unClassVisible" v-model:visible="unClassVisible" :blurFlag="true">
    <div class="flex flex-col my-3" style="width:500px;" v-if="detailShow === false">
     <ModalTop title="添加新应用" @close="unClassVisible = false"/>
     <div class="flex flex-col px-6">
      <div class="p-4 flex rounded-lg flex-col xt-bg-2">
       <span class="font-16 font-400 mb-2.5 xt-text xt-font">选择类型</span>
       <span class="font-14 font-400 xt-text-2 xt-font">
        你可以选择添加桌面，关联工作台内部的社区，也可以选择关联你的群聊，还支持自定义添加网页应用链接，把需要的资源全部整合到社群当中，与你的小伙伴们一起分享和协作。
       </span>
      </div>
      <div class="flex flex-col mt-4">
       <div v-for="item in channelList" class="flex items-center xt-bg-2 pointer rounded-lg px-6 py-5 mb-4"
        :class="{'select-bg':selectIndex === item.type}" @click="selectChannel(item)">
        <ChannelIcon :icon="item.icon" style="font-size: 2.5em;"></ChannelIcon>
        <span class="pl-4 font-16 font-400 xt-font xt-text" >{{ item.name }}</span>
       </div>
      </div>
      <div class="flex items-center justify-end">
       <xt-button w="64" h="40" class="mr-3 category-button" @click="unClassVisible = false">取消</xt-button>
       <xt-button w="64" h="40" type="theme" class="category-button" @click="selectSubmit">确定</xt-button>
      </div>
     </div>
    </div>
    <ChannelLink :id="item.id" :no="no" v-else-if="selectIndex === 'link' && detailShow === true" @back="detailShow = false" @close="unClassVisible = false"/>
    <ForumChannel  :id="item.id" :no="no" v-else-if="selectIndex === 'community' && detailShow === true" @back="detailShow = false" @close="unClassVisible = false"/>
    <ChannelGroup :id="item.id" :no="no" v-else-if="selectIndex === 'group' && detailShow === true" @back="detailShow = false" @close="unClassVisible = false"/>
   </Modal>
 </teleport>
</template>

<script>
import { Icon as ChannelIcon } from '@iconify/vue'

import Modal from "../../../../components/Modal.vue";
import ModalTop from '../ModalTop.vue';
import ChannelLink from '../knownCategory/ChannelLink.vue';
import ForumChannel from '../knownCategory/ForumChannel.vue';
import ChannelGroup from '../knownCategory/ChannelGroup.vue';

export default {
 components:{
  Modal,ModalTop,ChannelIcon,ChannelLink,ForumChannel,ChannelGroup
 },

 props:['no','item'],

 data(){
  return{
   unClassVisible:false,
   channelList:[
    // { icon:'fluent-emoji-flat:desktop-computer',name:'桌面',type:'desk'},
    { icon:'fluent-emoji-flat:placard',name:'社区',type:'community' },
    { icon:'fluent-emoji-flat:thought-balloon',name:'群聊',type:'group' },
    { icon:'fluent-emoji-flat:globe-with-meridians',name:'网页链接',type:'link' }
   ],
   selectIndex:'community',
   detailShow:false,
  }
 },

 methods:{
  openUnClassModal(){
   this.unClassVisible = true
  },
  // 选择类型
  selectChannel(item){
   this.selectIndex = item.type
  },
  // 进入当前选择的详情
  selectSubmit(){
   this.detailShow = true
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