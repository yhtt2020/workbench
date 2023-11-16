<template>
  <div class="flex flex-col my-3" style="width: 500px" v-if="chatShow === false">
    <ModalTop title="添加群聊" back="true" @close="closeChannel" @back="backChannel"/>
    <div class="px-6 flex-col mt-4">
      <div v-for="item in list" class="flex flex-col xt-bg-2 p-4 mb-4 rounded-lg pointer" 
       :class="{'select-bg':listIndex === item.type}" @click="selectChannel(item)"
      >
      <span class="font-16 font-400 xt-text xt-font mb-2.5">{{ item.title }}</span>
      <span class="font-14 font-400 xt-text-2 xt-font">{{ item.summary }}</span>
      </div>

      <div class="flex items-center justify-end">
        <xt-button w="64" h="40" class="mr-3 category-button"  @click="closeChannel">取消</xt-button>
        <xt-button w="64" h="40" class="category-button" type="theme" @click="selectSubmit">选择</xt-button>
      </div>
    </div>
  </div>

  <CreateNewGroup v-if="listIndex === 'create' && chatShow === true " :no="no" @close="closeChannel"  @back="chatShow = false"/>
  <ChannelKnownGroup :no="no" v-if="listIndex === 'related' && chatShow === true"  @back="chatShow = false" @close="closeChannel"/>
</template>

<script>

import ModalTop from '../ModalTop.vue';
import CreateNewGroup from '../CreateNewGroups.vue';
import ChannelKnownGroup from './ChannelKnownGroup.vue';

export default {
 components:{
  ModalTop,CreateNewGroup,ChannelKnownGroup,
 },

 props:['type','no'],

 data(){
  return{
    list:[
     { title:'创建新群聊',summary:'选择你的联系人，创建一个新的群聊关联到社群中。',type:'create' },
     { title:'添加已有群聊',summary:'选择你已经创建的群聊，将他们批量关联到社群中。',type:'related' }
    ],
    listIndex:'create',
    chatShow:false,
  }
 },

 methods:{
  closeChannel(){
    this.$emit('close')
  },
  backChannel(){
    this.$emit('back')
  },
  // 选择加入方式
  selectChannel(item){
    this.listIndex = item.type
  },
  selectSubmit(){
    this.chatShow = true
  }
 }

};
</script>

<style lang="scss" scoped>
.select-bg {
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg) !important;
}
</style>