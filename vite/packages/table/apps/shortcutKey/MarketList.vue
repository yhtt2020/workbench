<template>
  <!-- 方案列表 -->
  <div class="flex flex-row" style="height: 100%">
    <div class="item-content">
      <div v-for="item in navLists" :key="item.id" class="pointer recommend" @click="previewKay(item)">
        <div class="flex justify-between">
          <div class="flex">
            <span class="h-14 w-14 flex justify-center items-center">
              <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
            </span>
            <span class="flex flex-col ml-4">
              <span style="font-size: 18px;color: var(--primary-text);font-weight: 500;">{{ item.name }}</span>
              <span class="mt-1" style="font-size: 16px;color: var(--secondary-text);">{{ item.commonUse }}</span>
            </span>
          </div>
          <div class="flex flex-col justify-center items-center w-16 h-16 xt-mask rounded-lg">
            <span style="font-family: Oswald-SemiBold;font-size: 24px;color: var(--primary-text);font-weight: 600;">{{ item.number }}</span>
            <span class="xt-text">{{item.key}}</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4" style="font-size: 14px;color: var(--secondary-text);">
          <span class="flex items-center">
            <div @click="showCard(item.id)">
              <!-- <a-avatar size="24">
                  <template #icon><UserOutlined /></template>
              </a-avatar> -->
              <a-avatar shape="square" :src="item.avatar" :size="32"></a-avatar>
            </div>
            <span class="ml-3" style="color: var(--secondary-text);">{{ item.nickName }}</span>
          </span>
          <span style="color: var(--secondary-text);">
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
      <div class="recommend" style="opacity: 0;height: 1px;"></div>
    </div>
  </div>
  <!-- 预览 -->
  <Preview :keyScheme="keyScheme" :showModal="showModal" @closePreview="closePreview"></Preview>
</template>

<script>
import { appStore } from '../../store';
import ShortcutKeyList from '../../components/shortcutKey/ShortcutKeyList.vue';
import { mapActions, mapWritableState } from "pinia";
import { keyStore } from './key'
import Preview from '../../components/shortcutKey/Preview.vue';
export default {
  name: "MarketList",
  components: {
    ShortcutKeyList,
    Preview
  },
  data() {
    return {
      navLists: [],
      // 快捷方案
      keyScheme: {},
      // 预览
      showModal: false,
      // 添加
      openDrawer: false
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
    }
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
    ...mapActions(keyStore,['setShortcutKeyList']),
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
    previewKay(item){
      this.keyScheme = item
      this.showModal = true
    },
    closePreview(){
      this.showModal = false
    }
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
    background: var(--mask-bg);
    border-radius: 12px;
    width: 356px;
    height: 136px;
    margin: 0 8px 16px;
    padding: 12px;
  }
  .prompt-modal{
      position: absolute;
      top:0;
      bottom:0;
      right:0;
      left:0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px;
      z-index: 99;
      .head-icon{
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 10%;
        .icon{
          background: #2A2A2A;
          border-radius: 12px;
          width: 48px;
          height: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }
      .foot{
        display: flex;
        justify-items: center;
        align-items: end;
        height: 10%;
        >div{
          background: rgba(0,0,0,0.30);
          border-radius: 12px;
          height: 48px;
          line-height: 48px;
          padding: 0 25px;
          font-size: 16px;
          color: var(--secondary-text);
        }
      }
    }
    .add-scheme{
      background: #2A2A2A;
      border-radius: 12px;
      width: 80px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .drawer-center{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 30%;
    }
</style>
