<template>
 <div class="flex flex-col my-3" style="width:500px;" v-if="nextShow === false">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <span class="font-16-400" style="color:var(--primary-text);">添加新频道</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
    <!-- <CloseOutlined  style="font-size: 1.25em;"/> -->
    <ChannelIcon icon="fluent:dismiss-16-filled"  style="font-size: 1.25em;color: var(--secondary-text);"/>
   </div>
  </div>
  
  <div class="flex flex-col px-6">
   <div class="p-4 flex rounded-lg flex-col" style="background: var(--secondary-bg);">
    <span class="font-16-400 mb-2.5" style="color:var(--primary-text);">选择类型</span>
    <span class="font-14-400" style="color:var(--secondary-text)">
     你可以选择添加桌面，关联工作台内部的社区，也可以选择关联你的群聊，还支持自定义添加网页应用链接，把需要的资源全部整合到社群当中，与你的小伙伴们一起分享和协作。
    </span>
   </div>
   <div class="flex flex-col mt-4">
    <div v-for="item in channelList" class="flex items-center pointer rounded-lg px-6 py-5 mb-4" 
     style="background: var(--secondary-bg);" :class="{'select-bg':selectIndex === item.type}" @click="selectChannel(item)">
     <ChannelIcon :icon="item.icon" style="font-size: 2.5em;"></ChannelIcon>
     <span class="pl-4 font-16-400" style="color:var(--primary-text);">{{ item.name }}</span>
    </div>
   </div>
  </div>

  <div class="px-6">
   <div class="flex items-center justify-end">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">取消</XtButton>
    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);" @click="selectSubmit">选择</XtButton>
   </div>
  </div>
 </div>

 <!-- <SelectDesk v-if="selectIndex === 'desk' && nextShow === true" @close="closeChannel" @back="nextShow = false"></SelectDesk> -->
 <SelectChannel v-if="selectIndex === 'community' && nextShow === true" :no="no" @close="closeChannel" @back="nextShow = false"></SelectChannel>
 <SelectGroupChat v-if="selectIndex === 'group' && nextShow === true " :no="no" type="group" @close="closeChannel" @back="nextShow = false"></SelectGroupChat>
 <SelectWebLink v-if="selectIndex === 'link' && nextShow === true " type="link" :no="no" @close="closeChannel" @back="nextShow = false"></SelectWebLink>

</template>

<script>
import { defineComponent, reactive,toRefs } from 'vue'
//  import { CloseOutlined } from '@ant-design/icons-vue'
import { Icon as  ChannelIcon } from '@iconify/vue'


import Modal from '../../../components/Modal.vue'
// import SelectDesk from './channelSelect/selectDesk.vue'
import SelectChannel from './channelSelect/ChannelCommunity.vue'
import SelectGroupChat from './channelSelect/ChannelGroupChat.vue'
import SelectWebLink from './channelSelect/ChannelWebLink.vue'

export default defineComponent({
 components:{
 //  CloseOutlined,
  ChannelIcon,Modal,
  // SelectDesk,
  SelectChannel,
  SelectGroupChat,SelectWebLink,
 },

 props:['no'],

 setup (props,ctx) {

  const data = reactive({
   channelList:[
    // { icon:'fluent-emoji-flat:desktop-computer',name:'桌面',type:'desk'},
    { icon:'fluent-emoji-flat:placard',name:'社区',type:'community' },
    { icon:'fluent-emoji-flat:thought-balloon',name:'群聊',type:'group' },
    { icon:'fluent-emoji-flat:globe-with-meridians',name:'网页链接',type:'link' }
   ],
   selectIndex:'community',
   nextShow:false, // 选择完第一步的是否进入第二步
   type:'',
  })
  
  // 创建新频道弹窗
  const closeChannel = () =>{
    ctx.emit('close')
  }

  // 选择频道
  const selectChannel = (item) =>{
   data.selectIndex = item.type
   data.type = item.type
  }

  // 最后选择按钮
  const selectSubmit = () =>{
    data.nextShow = true
  }


  return {
   ...toRefs(data),closeChannel,selectChannel,selectSubmit,
  }
 }
})
</script>

<style lang="scss" scoped>
.font-16-400{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
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

.font-14-400{
 font-family: PingFangSC-Regular;
 font-size: 14px;
 font-weight: 400;
}

.select-bg{
 background: var(--active-secondary-bg) !important;
 border:1px solid var(--active-bg) !important;
}
</style>
