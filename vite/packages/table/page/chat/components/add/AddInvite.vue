<template>
 <teleport to="body">
  <Modal v-model:visible="addVisible" v-if="addVisible" :blurFlag="true" style="z-index:200 !important;">
    <div class="flex flex-col my-3" style="width: 500px ;" v-if="inviteShow === false">
     <ModalTop title="邀请其他人" @close="addVisible = false"/>
     <div class="px-6 flex flex-col">
      <div class="p-4 xt-bg-2 rounded-md flex flex-col pointer mb-4" v-for="item in inviteMethod" @click.stop="inviteEnter(item)">
        <div class="flex w-full justify-between items-center mb-2.5">
          <span class="font-16 font-400 xt-text xt-font">{{ item.title }}</span>
          <NewIcon icon="fluent:chevron-right-16-filled"  style="font-size:20px;color:var(--secondary-text);"/>
        </div>
        <div class="font-14 font-400 xt-text-2 xt-font">
          {{ item.summary }}
        </div>
      </div>
      <div class="xt-bg-2 p-4 flex rounded-md flex-col">
        <span class="font-16 font-400 xt-text xt-font">邀请链接</span>
        <span class="font-14 font-400 mt-2.5 mb-3 xt-text-2 xt-font">
          通过链接邀请新成员，访问链接即可加入。链接支持外部浏览器访问。
        </span>
        <div class="flex mb-6">
          <a-input disabled="true" class="h-10" v-model:value="linkValue" style="width:82%;border-radius: 12px;" />
          <xt-button w="64" h="40" type="theme" class="ml-3" @click="linkCopy">复制</xt-button>
        </div>
      </div>
      <xt-button w="64" h="22" class="my-3">重置链接</xt-button>
     </div>
    </div>
    <AddDirectly v-else-if="inviteShow === true && type === 'direct'" :no="no" @close="addVisible = false" @back="inviteShow = false"/>
    <InvitationJoin v-else-if="inviteShow == true && type === 'invite'" :no="no" @close="addVisible = false" @back="inviteShow = false"/>
  </Modal>
 </teleport>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { teamStore } from '../../../../store/team';
import { Icon as NewIcon } from '@iconify/vue';
import useClipboard from 'vue-clipboard3';
import { message } from 'ant-design-vue'


import Modal from '../../../../components/Modal.vue';
import ModalTop from '../ModalTop.vue';
import InvitationJoin from '../invite/InvitationJoin.vue';
import AddDirectly from '../invite/AddDirectly.vue';

export default {
 components:{
  NewIcon,Modal,ModalTop,InvitationJoin,AddDirectly
 },

 props:['no'],

 data(){
  return{
   addVisible:false,
   linkValue:'s.apps.vip',
   inviteMethod:[
    {title:'直接添加',summary:'来自我的小队成员、好友，确认选择后自动加入社群。',type:'direct'},
    {title:'邀请加入',summary:'支持批量发送邀请信息到群聊或好友，对方接受邀请后即可加入。',type:'invite'}
   ],
   type:'',
   inviteShow:false,
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
  openAddInvite(){
   this.addVisible = true
  },
  // 进入指定邀请界面
  inviteEnter(item){
    this.type = item.type
    this.inviteShow = true
  },
  // 复制邀请链接
  async linkCopy(){
    const { toClipboard } = useClipboard();
    const res = await toClipboard(this.linkValue);
    if(res.text !== ""){
      message.success('链接成功复制');
    }
  },
 }
};
</script>

<style lang="scss" scoped>
</style>