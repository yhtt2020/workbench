<template>
 <div class="flex flex-col mb-6" style="width:500px;" v-if="inviteShow === false">
  <div class="flex w-full items-center justify-center h-10 m-3">
   <span class="category-16-400" style="color:var(--primary-text);">邀请其他人</span>
   <div class="flex items-center category-button pointer rounded-lg justify-center w-10 h-10" 
    style="position: absolute; top:12px;right:8px;background: var(--secondary-bg);"
    @click="closeButton"
   >
    <InviteIcon  icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;"/>
   </div>
  </div>

  <div class="px-6 flex flex-col">
   <div class="invite-bg p-4 flex flex-col pointer mb-4" v-for="item in inviteMethod" @click.stop="inviteEnter(item)">
    <div class="flex w-full justify-between items-center mb-2.5">
      <span class="category-16-400" style="color: var(--primary-text);">{{ item.title }}</span>
      <InviteIcon icon="fluent:chevron-right-16-filled"  style="font-size:20px;color:var(--secondary-text);"/>
    </div>
    <div class="category-14-400" style="color: var(--secondary-text);">
     {{ item.description }}
    </div>
   </div>

   <div class="invite-bg p-4 flex flex-col">
    <span class="category-16-400" style="color:var(--primary-text);">邀请链接</span>
    <span class="category-14-400 mt-2.5 mb-3" style="color:var(--secondary-text);">
      通过链接邀请新成员，访问链接即可加入。链接支持外部浏览器访问。
    </span>
    
    <div class="flex mb-6">
      <a-input disabled="true" class="h-10" v-model:value="linkValue" style="width:82%;border-radius: 12px;" />
      <div class="rounded-md px-4 h-10 ml-3 category-button pointer flex items-center justify-center"
       style="background: var(--active-bg);" @click="linkCopy"
      >
        复制
      </div>
    </div>
  
    <div class="category-16-400 pointer category-button" style="color:var(--active-bg);">重置链接</div>
   </div>
  </div>
 </div>


 <AddDirectly v-if="inviteShow && type === 'directly'" :no="no" @close="closeButton" @back="inviteShow = false"/>
 <InvitationJoin v-if="inviteShow && type === 'inviteJoin'" :no="no" @close="closeButton" @back="inviteShow = false"/>

</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { Icon as InviteIcon } from '@iconify/vue'
import useClipboard from 'vue-clipboard3'
import { message } from 'ant-design-vue'
import { teamStore } from '../../../store/team'

import AddDirectly from './invite/AddDirectly.vue'
import InvitationJoin from './invite/InvitationJoin.vue'

export default {
 components:{
  InviteIcon,AddDirectly,InvitationJoin,
 },

 props:['no'],

 data(){
  return{
    linkValue:'s.apps.vip',
    inviteShow:false,
    inviteMethod:[
      {title:'直接添加',description:'来自我的小队成员、好友，确认选择后自动加入社群。',type:'directly'},
      // 组织成员和
      {title:'邀请加入',description:'支持批量发送邀请信息到群聊或好友，对方接受邀请后即可加入。',type:'inviteJoin'}
    ],
    type:''
  }
 },

 computed:{
  ...mapWritableState(teamStore,['team','my']),
 },

 mounted(){
  
  this.updateMy(0)
  this.getTeamMembers(this.team.no,0,0)
  this.getTeamLeader(this.team.no,0,0)
 
 },

 methods:{
  ...mapActions(teamStore,['getTeamLeader','getTeamMembers','updateMy']),
  closeButton(){
   this.$emit('close')
  },

  // 复制邀请链接
  async linkCopy(){
    const { toClipboard } = useClipboard();
    const res = await toClipboard(this.linkValue);
    if(res.text !== ""){
      message.success('链接成功复制');
    }
  },

  inviteEnter(item){
    this.type = item.type
    this.inviteShow = true
  },




      
 }

}
</script>

<style lang="scss" scoped>
</style>