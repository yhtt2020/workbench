<template>
  <div class="flex flex-col my-3" style="width:500px;" v-if="chatShow === false">
    <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
     <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
      <ChannelIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5rem;color: var(--secondary-text);" />
     </div>
     <span class="category-16-400" style="color:var(--primary-text);">添加群聊</span>
     <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
      <ChannelIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;color: var(--secondary-text);" />
     </div>
    </div>
  
    <div class="px-6 flex-col mt-4">
     <div v-for="item in list" class="flex flex-col p-4 mb-4 rounded-lg pointer"  @click="selectChannel(item)"
     style="background: var(--secondary-bg);" :class="{'select-bg':listIndex === item.type}">
      <span class="category-16-400 mb-2.5" style="color:var(--primary-text);">{{ item.title }}</span>
      <span class="category-14-400" style="color:var(--secondary-text);">{{ item.summary }}</span>
     </div>
    </div>
  
    <div class="px-6">
     <div class="flex items-center justify-end">
      <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">取消</XtButton>
      <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);"  @click="selectSubmit">选择</XtButton>
     </div>
    </div>
  </div>
  
  <ChannelGroupChat v-if="listIndex === 'already' && chatShow" :id="id" :no="no" @close="closeChannel"  @back="chatShow = false"/>
  <ChannelNewGroup v-if="listIndex === 'create' && chatShow" :id="id" :no="no" @close="closeChannel"  @back="chatShow = false"/>
</template>

<script>
import { Icon as ChannelIcon } from '@iconify/vue'
import ChannelGroupChat from './ChannelGroupChat.vue'
import ChannelNewGroup from './ChannelNewGroup.vue'

export default {
  components:{
    ChannelIcon,ChannelGroupChat,ChannelNewGroup,
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

.active-button{
  &:active{
   filter: brightness(0.8);
   opacity: 0.8;
  }
  &:hover{
   opacity: 0.8;
  }
}

.select-bg{
  background: var(--active-secondary-bg) !important;
  border:1px solid var(--active-bg) !important;
}
 
</style>