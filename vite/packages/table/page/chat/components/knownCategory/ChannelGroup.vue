<template>
  <div class="flex flex-col my-3" style="width:500px;" v-if="chatShow === false">
    <ModalTop title="添加群聊" back="true" @close="closeChannel" @back="backChannel"/>
    <div class="px-6 flex-col mt-4">
     <div v-for="item in list" class="flex flex-col p-4 mb-4 xt-bg-2 rounded-lg pointer"  @click="selectChannel(item)" :class="{'select-bg':listIndex === item.type}">
      <span class="font-16 font-400 mb-2.5 xt-text xt-font">{{ item.title }}</span>
      <span class="font-14 font-400 xt-text-2 xt-font">{{ item.summary }}</span>
     </div>
     <div class="flex items-center justify-end">
      <xt-button w="64" h="40" class="category-button mr-3" @click="closeChannel">取消</xt-button>
      <xt-button w="64" h="40" type="theme" class="category-button" @click="selectSubmit">确定</xt-button>
     </div>
    </div>
  </div>
  <ChannelGroupChat v-if="listIndex === 'already' && chatShow" :id="id" :no="no" @close="closeChannel"  @back="chatShow = false"/>
  <ChannelNewGroup v-if="listIndex === 'create' && chatShow" :id="id" :no="no" @close="closeChannel"  @back="chatShow = false"/>
</template>

<script>
import { Icon as ChannelIcon } from '@iconify/vue';

import ChannelGroupChat from './ChannelGroupChat.vue';
import ChannelNewGroup from './ChannelNewGroup.vue';
import ModalTop from '../ModalTop.vue';

export default {
  components:{
    ChannelIcon,ChannelGroupChat,ChannelNewGroup,ModalTop,
  },

  props:['no','id'],

  data(){
   return{
    chatShow:false,
    list:[
     { title:'创建新群聊',summary:'选择你的联系人，创建一个新的群聊关联到社群中。',type:'create' },
     { title:'添加已有群聊',summary:'选择你已经创建的群聊，将他们批量关联到社群中。',type:'already' }
    ],
    listIndex:'create',
   }
  },

  methods:{
    closeChannel(){
      this.$emit('close')
    },
    backChannel(){
      this.$emit('back')
    },

    selectChannel(item){
      this.listIndex = item.type
    },

    selectSubmit(){
      this.chatShow = true
    }

  }
}
</script>

<style lang="scss" scoped>
.back-button{
  position: absolute;
  top: 1px ;
  left: 12px;
}
.close-channel{
  position: absolute;
  top:1px;
  right:12px;
}
.select-bg{
  background: var(--active-secondary-bg) !important;
  border:1px solid var(--active-bg) !important;
}
 
</style>