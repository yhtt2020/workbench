<template>
 <div class="flex flex-col my-3" style="width:500px;">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <div class="back-button w-10 h-10 flex items-center rounded-lg pointer category-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
    <ForumIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5em;color: var(--secondary-text);"/>
   </div>
   <span class="font-16 font-400" style="color:var(--primary-text);">选择社区版块</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer category-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
    <ForumIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25em;color: var(--secondary-text);"/>
   </div>
  </div>

  <div class="flex flex-col px-6">
   <span class="px-4 font-16 font-400 mb-4" style="color: var(--primary-text);">我创建的版块({{forumList.length}})</span>
   <vue-custom-scrollbar :settings="settingsScroller" style="height: 300px;">
    <div v-for="(item,index) in forumList" class="flex items-center mb-3 pointer p-5 rounded-lg" :class="{'select-bg':selectIndex === index}"
     style="background: var(--secondary-bg);" @click="selectForum(index,item)"
    >
     <a-avatar :size="40" shape="square" :src="item.logo"></a-avatar>
     <span class="category-16-400 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
    </div>
   </vue-custom-scrollbar>



   <div class="mt-4 flex items-center justify-end" style="height:40px;">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">
     取消
    </XtButton>

    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);" @click="createForumChannel">
     确定
    </XtButton>
   </div>
  </div>
 </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { Icon as ForumIcon } from '@iconify/vue'
import { forumStore } from '../../store/forumStore'
import { communityStore } from '../../store/communityStore'
import { channelClass } from '../../../../js/chat/createChannelClass'
import { message } from 'ant-design-vue'

export default {

props:['id','no'],

components:{
 ForumIcon
},

data(){
 return{
  settingsScroller: {
   useBothWheelAxes: true,
   swipeEasing: true,
   suppressScrollY: false,
   suppressScrollX: true,
   wheelPropagation: true
  },
  selectIndex:-1,
  selectForumItem:'',
 }
},

computed:{
 ...mapWritableState(forumStore,['forumList']),
},

async mounted(){
 await this.getForumData()
},

methods:{
 ...mapActions(forumStore,['getForumData']),
 ...mapActions(communityStore,['getChannelList','getCategoryData']),

 closeChannel(){
  this.$emit('close')
 },
 backChannel(){
  this.$emit('back')
 },

 selectForum(index,item){
   if(this.selectIndex === index){
    this.selectIndex = -1
    this.selectForumItem = ''
   }else{
    this.selectIndex = index
    this.selectForumItem = item
   }
 },

 async createForumChannel(evt){
  if(this.selectIndex !== -1 && this.selectForumItem !== ''){
   const option = { type:'forum', id:this.id,  no:this.no,content:{name:this.selectForumItem.name,props:this.selectForumItem} }
   //  console.log('查看参数',option)
   const res = await  channelClass.secondaryChannel(option)
   //  console.log('查看状态',res)
   if(res?.status === 1){
    message.success(`${res.info}`)
    this.getChannelList(this.no)
    this.getCategoryData(this.no)
    this.closeChannel()
   }
  }else{
   evt.preventDefault()
  }
 }

}

}
</script>

<style lang="scss" scoped>
.close-channel{
 position: absolute;
 top:1px;
 right:12px;
}

.back-button{
 position: absolute;
 top: 1px ;
 left: 12px;
}

.select-bg{
 background: var(--active-secondary-bg) !important;
 border:1px solid var(--active-bg) !important;
}
</style>
