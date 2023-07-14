<template>
  <vueCustomScrollbar :settings="scrollbarSettings" @touchstart.stop @touchmove.stop @touchend.stop
                      style="padding: 15px;white-space: nowrap;height: 100%">

    <div class="card half mr-3" style="width:330px;background: var(--primary-bg);color: var(--primary-text);padding:0;position: relative">
      <userCard :uid="userInfo.uid" :userInfo="userInfo">
      </userCard>
      <span @click="toggleFrameStore()" style="position: absolute;right: 20px;top: 40px;" class="px-4 py-2 xt-active-bg rounded-full  pointer"><icon icon="gift" style="font-size: 18px"></icon> 头像框商店</span>
    </div>



    <div class="mr-3" style="width: 400px;display: inline-block;vertical-align: top;white-space: pre-wrap">
      <!-- 快速搜索 用户->我的 -->
      <div class="card half" style="width: 400px;padding: 1em;display: inline-block;margin-bottom: 1em;background: var(--primary-bg);color: var(--primary-text);">
        <ComPanel></ComPanel>
      </div>
      <div class="card half" style="width: 400px;padding: 1em;display: inline-block;background: var(--primary-bg);color: var(--primary-text);">
        <ComActionPanel></ComActionPanel>
      </div>
    </div>
    <div class="card" style="width: 400px;padding: 1em;display: inline-block;margin-bottom: 1em;background: var(--primary-bg);color: var(--primary-text);">
      <GroupPanel></GroupPanel>
    </div>

  </vueCustomScrollbar>
</template>

<script>
import GradePanel from '../../components/comp/GradePanel.vue'
import ComPanel from '../../components/comp/ComPanel.vue'
import ComActionPanel from '../../components/comp/ComActionPanel.vue'
import GroupPanel from '../../components/comp/GroupPanel.vue'
import UserCard from '../../components/small/UserCard.vue'
import { mapState } from 'pinia'
import { appStore } from '../../store'
import FrameStoreWidget from '../../components/team/FrameStoreWidget.vue'
export default {
  name: 'My',
  components: { UserCard, GroupPanel, ComActionPanel, ComPanel, GradePanel,FrameStoreWidget },
  computed: {
    ...mapState(appStore, ['userInfo'])
  },
  data(){
    return {
      frameStoreVisible:false,
      hideAdmin:false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
    }
  },methods:{
    toggleFrameStore(){
      window.toggleFrameStore()
    }
  }
}
</script>

<style scoped>
.card{
  background: #252525;
}
</style>
