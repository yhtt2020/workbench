<template>
  <div class="flex flex-row" style="height: 100%">
    <div class="item-content">
      <div v-for="item in navLists" :key="item.id" class="pointer recommend">
        <div class="flex justify-between">
          <div class="flex">
            <span class="h-14 w-14 flex justify-center items-center">
              <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
            </span>
            <span class="flex flex-col ml-4">
              <span style="font-size: 18px;color: rgba(255,255,255,0.85);font-weight: 500;">{{ item.name }}</span>
              <span class="mt-1" style="font-size: 16px;color: rgba(255,255,255,0.60);">{{ item.commonUse }}</span>
            </span>
          </div>
          <div class="flex flex-col justify-center items-center w-16 h-16 s-bg rounded-lg">
            <span style="font-family: Oswald-SemiBold;font-size: 24px;color: rgba(255,255,255,0.85);font-weight: 600;">{{ item.number }}</span>
            <span>{{item.key}}</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4" style="font-size: 14px;color: rgba(255,255,255,0.60);">
          <span class="flex items-center">
            <div @click="showCard(item.id)">
              <a-avatar size="24">
                  <template #icon><UserOutlined /></template>
              </a-avatar>
            </div>
            <span class="ml-3">{{ item.userName }}</span>
          </span>
          <span>
            <span>
              <Icon icon="dianzan" class="mr-2"></Icon>
              <span>{{ item.sumLikes }}</span>
            </span>
            <span class="ml-3">
              <Icon icon="xiazai" class="mr-2"></Icon>
              <span>{{ item.download }}</span>
            </span>
          </span>
        </div>
      </div>
      <div class="recommend" style="opacity: 0;height: 1px;"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import { appStore } from '../../store';
export default {
  name: "MarketList",
  data() {
    return {
      navLists: []
    }
  },
  props: {
    //排序列表
    navList: {
      type: Object,
      default: {},
    },
    //下拉框选中的类型
    selected: {
      type: String
    },
  },
  watch: {
    navList: {
      immediate: true,
      handler () {
        this.navLists = JSON.parse(JSON.stringify(this.navList))
      }
    },
    selected: {
      immediate: true,
      deep: true,
      handler (newV, oldV) {
        if (newV == '下载次数') this.navLists = this.mySort(this.navLists, 'download')
        else if (newV == '更新时间') this.navLists = this.mySort(this.navLists, 'time')
        else this.navLists = this.navList
      }
    },
  },
  methods: {
    ...mapActions(appStore,['showUserCard']),
    showCard(id){
      this.showUserCard(id)
    },
    mySort (data, property, asc) {
      let datas = [...data]
      return datas.sort(function (a, b) {
        a = a[property]
        b = b[property]
        if (asc) return a - b
        else return b - a
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .item-content{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
    justify-content: center;
  }
  .item-content::-webkit-scrollbar{
    display: none;
  }
  .recommend{
    background: rgba(0,0,0,0.30);
    border-radius: 12px;
    width: 356px;
    height: 136px;
    margin: 0 8px 16px;
    padding: 12px;
  }
  .s-bg{
    box-shadow: none !important;
  }
</style>
