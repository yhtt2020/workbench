<template>
  <div class="flex flex-col overflow pt-1" v-if="rankList.length">
    <div  v-for="item in rankList" :key="item.id"
          class="w-full flex items-center rounded-lg justify-between pointer set-type" style="margin: 6px 0 6px;">
      <span class="ranking">{{ item.id }}</span>
      <div class="flex-1 flex ml-3 items-center">
        <a-avatar @click="showCard(item.uid)" :src="item.avatar"></a-avatar>
        <div @click="showCard(item.uid)" class="ml-3 truncate" style="color: var(--primary-text);font-size: 16px;max-width: 120px;">
          {{ item.nickname }}
        </div>
      </div>
      <div style="color:var(--secondary-text);font-size: 16px;">
        {{ item[lastName] }} 
        <span> {{ unit }}</span>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col overflow pt-1">
    <div class="text-center py-5">暂未开放，敬请期待</div>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { appStore } from '../../store'
export default {
  name: 'RankList',
  components: {
  },
  props: {
    // 排行榜列表
    rankList: {
      type: Array,
      default: []
    },
    // 每列的最后一个属性
    lastName: {
      type: String,
      default: () => ''
    },
    // 单位
    unit: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      
    }
  },
  methods: {
    ...mapActions(appStore,['showUserCard']),
    showCard(uid){
      this.showUserCard(uid)
    },
   
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
