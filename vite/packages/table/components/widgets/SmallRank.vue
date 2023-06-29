<template>
  <Widget 
  :options="options" 
  :sizeList="sizeList"
  :desk="desk" 
  ref="rankingSmallSlot" 
  :menuList="toggleRankingList">
  <div class="bg-mask rounded-lg px-3 py-1 pointer" @click="showDrawer"
    style="position: absolute;left: 45px;top:10px;background: var(--primary-bg);color:var(--primary-text)">{{ rankingType[rankingIndex].title }}
  </div>
    <!-- 总在线时长榜 -->
    <div class="flex flex-col overflow content-box pt-1" v-if="rankingIndex === 0">
      <div  v-for="item in onLineList" :key="item.id"
            class="w-full flex items-center rounded-lg justify-between pointer set-type" style="margin: 6px 0 6px;">
        <span class="ranking">{{ item.id }}</span>
        <div class="flex-1 flex ml-3 items-center">
          <a-avatar @click="showCard(item.uid)" :src="item.avatar"></a-avatar>
          <div @click="showCard(item.uid)" class="ml-3 truncate" style="color: var(--primary-text);font-size: 16px;max-width: 120px;">
            {{ item.nickname }}
          </div>
        </div>
        <div style="color:var(--secondary-text);font-size: 16px;">{{ item.totalDuration }} h</div>
      </div>
    </div>
    <!-- 净在线时长榜 -->
    <div class="flex flex-col overflow content-box pt-1" v-if="rankingIndex === 1">
      <div  v-for="item in onLineList" :key="item.id"
            class="w-full flex items-center rounded-lg justify-between pointer set-type" style="margin: 6px 0 6px;">
        <span class="ranking">{{ item.id }}</span>
        <div class="flex-1 flex ml-3 items-center">
          <a-avatar @click="showCard(item.uid)" :src="item.avatar"></a-avatar>
          <div @click="showCard(item.uid)" class="ml-3 truncate" style="color: var(--primary-text);font-size: 16px;max-width: 120px;">
            {{ item.nickname }}
          </div>
        </div>
        <div style="color:var(--secondary-text);font-size: 16px;">{{ item.netDuration }} h</div>
      </div>
    </div>
    <!-- 小队榜 -->
    <div class="flex flex-col overflow content-box pt-1" v-if="rankingIndex === 2">
      <div  v-for="item in teamList" :key="item.id"
            class="w-full flex items-center rounded-lg justify-between pointer set-type" style="margin: 6px 0 6px;">
        <span class="ranking">{{ item.id }}</span>
        <div class="flex-1 flex ml-3 items-center">
          <a-avatar @click="showCard(item.uid)" :src="item.avatar"></a-avatar>
          <div @click="showCard(item.uid)" class="ml-3 truncate" style="color: var(--primary-text);font-size: 16px;max-width: 120px;">
            {{ item.nickname }}
          </div>
        </div>
        <div style="color:var(--secondary-text);font-size: 16px;">{{ item.onlineDuration }} h</div>
      </div>
    </div>
    <!-- 邀请榜 -->
    <div class="flex flex-col overflow content-box pt-1" v-if="rankingIndex === 3">
      <div  v-for="item in inviteList" :key="item.id"
            class="w-full flex items-center rounded-lg justify-between pointer set-type" style="margin: 6px 0 6px;">
        <span class="ranking">{{ item.id }}</span>
        <div class="flex-1 flex ml-3 items-center">
          <a-avatar @click="showCard(item.uid)" :src="item.avatar"></a-avatar>
          <div @click="showCard(item.uid)" class="ml-3 truncate" style="color: var(--primary-text);font-size: 16px;max-width: 120px;">
            {{ item.nickname }}
          </div>
        </div>
        <div style="color:var(--secondary-text);font-size: 16px;">{{ item.invite }} 人</div>
      </div>
    </div>
    <!-- 签到榜 -->
    <div class="flex flex-col overflow content-box pt-1" v-if="rankingIndex === 4">
      <div  v-for="item in signInList" :key="item.id"
            class="w-full flex items-center rounded-lg justify-between pointer set-type" style="margin: 6px 0 6px;">
        <span class="ranking">{{ item.id }}</span>
        <div class="flex-1 flex ml-3 items-center">
          <a-avatar @click="showCard(item.uid)" :src="item.avatar"></a-avatar>
          <div @click="showCard(item.uid)" class="ml-3 truncate" style="color: var(--primary-text);font-size: 16px;max-width: 120px;">
            {{ item.nickname }}
          </div>
        </div>
        <div style="color:var(--secondary-text);font-size: 16px;">{{ item.signInTime }}</div>
      </div>
    </div>
  </Widget>
  <a-drawer v-model:visible="middleShow" title="设置" placement="right" width="500">
    <div class="flex flex-col" style="color:var(--primary-text)">
      <span   v-for="(item,index) in rankingType" :key="index"  
      @click="getRankingType(item,index)" 
      :class="rankingIndex === index ? 'active-index':''" 
      class="mb-4  text-center pointer change h-12 xt-bg-2 rounded-lg show-game-time py-3">
         {{ item.title }}
      </span>
    </div>
  </a-drawer>
</template>

<script>
import Widget from '../card/Widget.vue'
import { mapActions, mapWritableState } from 'pinia'
import { appStore } from '../../store'
import { onLineList,teamList,inviteList,signInList } from "../../js/rank"
export default {
  name: 'SmallRank',
  components: {
    Widget,
  },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    desk:{
      type:Object
    }
  },
  data () {
    return {
      options: {className: 'card small',title: '',icon: 'linechart',type: 'smallRank'},
      sizeList:[{title:'1x1',height:1,width:1,name:'1x1'},{title:'1x2',height:2,width:1,name:'1x2'},],
      //在线时长榜
      onLineList,
      // 小队榜
      teamList,
      // 邀请榜
      inviteList,
      // 签到榜
      signInList,
      middleShow: false,
      toggleRankingList:[ { icon: 'shezhi1', title: '设置', fn: () => {this.middleShow = true;this.$refs.rankingSmallSlot.visible = false } } ],
      rankingType: [
        {title:'总在线时长榜',name:'total'},
        {title:'净在线时长榜',name:'net'},
        {title:'小队榜',name:'team'},
        {title:'邀请榜',name:'invite'},
        {title:'今日签到榜',name:'today'},
        {title:'累计签到榜',name:'accrue'},
        {title:'连续签到榜',name:'series'},
      ],
      rankingIndex: 0,
    }
  },
  methods: {
    ...mapActions(appStore,['showUserCard']),
    showCard(uid){
      this.showUserCard(uid)
    },
    getRankingType(item,index){
      this.rankingIndex = index
    },
    showDrawer(){
      this.middleShow = true
      this.$refs.rankingSmallSlot.visible = false
    }
  }
}
</script>

<style scoped lang="scss">

.ranking {
  width: 24px;
  height: 24px;
  text-align: center;
  background: var(--mask-bg);
  border-radius: 4px;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 600;
}

.content-box {
  height: calc(100% - 35px);
  margin-top: 10px;
  overflow: hidden;
}

.set-type:nth-of-type(1) > span {
  background: #FE2C46;
}

.set-type:nth-of-type(2) > span {
  background: #FF6600;
}

.set-type:nth-of-type(3) > span {
  background: #FAAA10;
}

.active-index{
  background: var(--active-bg) !important;
}
</style>
