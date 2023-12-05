<template>
 <div class="mx-4" style="height: 466px; width:452px;">
  <vue-custom-scrollbar :settings="settingsScroller" style="height: 466px;">
   <div class="flex grid grid-cols-2 gap-3">
    <div v-for="item in recommendList" class="flex flex-col rounded-lg p-4 xt-bg-2">
     <div class="flex items-center mb-3">
      <a-avatar :size="40" :src="item.icon" shape="square"></a-avatar>
      <span class="font-16-500 pl-3 truncate" style="color:var(--primary-text);">{{ item.name }}</span>
     </div>
     <div class="flex justify-between">
      <span class="font-12-400" style="color:var(--secondary-text);">{{ item.memberNum }}人</span>
      <span class="font-12-400" style="color:var(--secondary-text);">{{ item.joinOption === 'freeAccess' ? '公开加入' : '审核加入' }}</span>
     </div>
     <a-divider style="height: 2px; background-color: var(--divider);margin: 16px 0;" />
     <xt-button v-if="isJoin(item)" h="40" style="width:100% !important;"  @click="closeJoinCom">已加入</xt-button>
     <xt-button v-else  h="40" type="theme" style="width:100% !important;" @click="joinNow(item)">立即加入</xt-button>
    </div>
   </div>
  </vue-custom-scrollbar>
 </div>
</template>

<script>
import { mapActions } from 'pinia';
import _ from 'lodash-es';
import { communityStore } from '../../store/communityStore';
import { message } from "ant-design-vue";

export default {
  props: ["list"],

  data() {
    return {
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true,
      },
    }
  },

  computed: {
    recommendList(){
     const listNull = this.list !== undefined && this.list !== null && this.list.length !== 0;
     if(listNull){
      return this.list;
     }
    },
  },

  methods: {
   ...mapActions(communityStore,['joinRecommendCommunity']),
   // 判断是否已经进入推荐社群
   isJoin(data){
    const findData = _.find(this.list,function(item){ return item.id === data.id });
    const findDataNull = findData !== undefined;
    if(findDataNull){
     return findData.status === 1
    }
   },
   // 立即加入
   async joinNow(item){
    const option = {no:item.no};
    const result = await this.joinRecommendCommunity(option);
    message.success(`${result.info}`);
    ctx.emit('close')
   },
  },
};
</script>

<style lang="scss" scoped>
</style>