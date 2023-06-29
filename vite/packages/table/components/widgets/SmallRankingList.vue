<template>
  <Widget :options="options[rankingIndex]" :desk="desk" ref="rankingSmallSlot" :menuList="toggleRankingList">
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
export default {
  name: 'SmallRankingList',
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
      options: [
      {className: 'card',title: '总在线时长榜',icon: 'linechart',type: 'smallRankingList'},
      {className: 'card',title: '净在线时长榜',icon: 'linechart',type: 'smallRankingList'},
      {className: 'card',title: '小队榜',icon: 'linechart',type: 'smallRankingList'},
      {className: 'card',title: '邀请榜',icon: 'linechart',type: 'smallRankingList'},
      {className: 'card',title: '今日签到榜',icon: 'linechart',type: 'smallRankingList'},
      {className: 'card',title: '累计签到榜',icon: 'linechart',type: 'smallRankingList'},
      {className: 'card',title: '连续签到榜',icon: 'linechart',type: 'smallRankingList'},
      ],
      // 总/净 在线时长榜
      onLineList: [
        {
          id: 1,
          uid: 111,
          avatar: '/icons/logo128.png',
          nickname: 'Victor Ruiz',
          totalDuration: 1453,
          netDuration: 1341,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/rocket.png'
        },
        {
          id: 2,
          uid: 112,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Harvey',
          totalDuration: 1253,
          netDuration: 1241,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/handshake.png'
        },
        {
          id: 3,
          uid: 113,
          avatar: '/icons/logo128.png',
          nickname: 'Russell Morgan',
          totalDuration: 1113,
          netDuration: 1011,
          team: '',
          icon: ''
        },
        {
          id: 4,
          uid: 114,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 5,
          uid: 115,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 6,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 7,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 8,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 9,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 10,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        }
      ],
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
  height: 92%;
  margin-top: 6px;
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
