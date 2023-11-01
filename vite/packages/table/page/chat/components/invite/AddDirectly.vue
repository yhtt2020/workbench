<template>
  <div class="flex flex-col mb-4" style="width:667px;height: 594px;">
   <div class="flex items-center justify-center" style="position: relative;line-height: 64px;">
     <div class="back-button w-10 h-10 pointer rounded-lg category-button flex items-center justify-center" @click="backButton">
      <DirectlyIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5rem;color: var(--secondary-text);"/>
     </div>
     <span class="font-16 font-400" style="color:var(--primary-text);">直接邀请联系人</span>
     <div class="close-button w-10 h-10 pointer rounded-lg category-button flex items-center justify-center" @click="closeButton">
      <DirectlyIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;color: var(--secondary-text);" />
     </div>
   </div>

   <ContactSelector inviteMode="direct" :list="{friendData,teamData}"  title="我的小队" :no="no"/>
  

  </div>
</template>
 
<script>
 import { mapActions,mapWritableState } from 'pinia'
 import { Icon as DirectlyIcon } from '@iconify/vue'
 import { teamStore } from '../../../../store/team'
 import { appStore } from '../../../../store'
 
 import ContactSelector from '../contact/ContactSelector.vue'

 export default {
  components:{
   DirectlyIcon,ContactSelector
  },

  props:['no'],
 
  data(){
   return{
    friendData:[]
   }
  },

  computed:{
    ...mapWritableState(teamStore,['teamMembers','teamLeader','my','team']),
    ...mapWritableState(appStore,['userInfo']),
    // 将小队中的自己进行过滤
    teamData(){
      // console.log('查看小队成员数据',);
      // console.log('查看小队队长数据', Object.keys(this.teamLeader.userInfo).length !== 0);
      if(Object.keys(this.teamMembers).length !== 0 && Object.keys(this.teamLeader.userInfo).length !== 0){
       const filterList = this.teamMembers.filter(item=>{
        return String(item.userInfo.uid) !== String(this.userInfo.uid)
       })
       const list = [this.teamLeader,...filterList]
       // console.log('查看小队数组', list)
       return list
      }
    },
   
  },

  mounted(){
    this.getFriend()
  },

 
  methods:{
    backButton(){
      this.$emit('back')
    },
    closeButton(){
      this.$emit('close')
    },

    async  getFriend(){
      const server = window.$TUIKit.tim
      const res = await server.getFriendList()
      // console.log('获取数据',res?.data);
      const list = res?.data.map((item)=>{ return item.profile })
      // console.log('过滤后的数据',list);
      this.friendData = list
    }

  }
 }
</script>
 
<style lang="scss" scoped>
 .back-button{
  position: absolute;
  top: 12px;
  left: 8px;
  background: var(--secondary-bg);
 }
 
 .close-button{
  position: absolute;
  top: 12px;
  right:8px;
  background: var(--secondary-bg);
 }
</style>