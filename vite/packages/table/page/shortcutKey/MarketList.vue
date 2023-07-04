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
              <!-- <a-avatar size="24">
                  <template #icon><UserOutlined /></template>
              </a-avatar> -->
              <a-avatar shape="square" :src="item.avatar" :size="32"></a-avatar>
            </div>
            <span class="ml-3" style="color: rgba(255,255,255,0.60);">{{ item.userName }}</span>
          </span>
          <span style="color: rgba(255,255,255,0.60);">
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
  <div class="prompt-modal s-bg" v-show="showModal">
    <div class="head-icon">
      <div class="icon" @click="showModal = false">
        <Icon icon="guanbi" style="width: 24px;height: 24px;"></Icon>
      </div>
      <div class="icon" @click="openDrawer = true">
        <Icon icon="tishi-xianxing" style="width: 24px;height: 24px;"></Icon>
      </div>
    </div>
    <div style="width:98%;height:80%;">
      <ShortcutKeyList :keyList="keyScheme.keyList" :keyBoxStyle="{background:'var(--primary-bg)'}"></ShortcutKeyList>  
    </div>
    <div class="foot">
      <div>{{ keyScheme.number }}个快捷键</div>
    </div>
  </div>
  <!-- 预览添加抽屉 -->
  <a-drawer v-model:visible="openDrawer" style="z-index:9999;" width="320" placement="right">
     <template #extra>
      <a-space>
        <div class="add-scheme" @click="addPlan">立即添加</div>
      </a-space>
    </template>
    <div class="drawer-center">
      <span class="h-14 w-14 flex justify-center items-center">
        <a-avatar shape="square" :src="keyScheme.icon" :size="48"></a-avatar>
      </span>
      <span class="mt-4" style="font-size: 18px;color: rgba(255,255,255,0.85);font-weight: 500;">{{ keyScheme.name }}</span>
      <span class="mt-1" style="font-size: 16px;color: rgba(255,255,255,0.60);">{{ keyScheme.commonUse }}</span>
      <span class="flex items-center my-4">
        <div>
          <a-avatar size="24">
              <template #icon><UserOutlined /></template>
          </a-avatar>
        </div>
        <span class="ml-3" style="color: rgba(255,255,255,0.60);">{{ keyScheme.userName }}</span>
      </span>
      <span style="color: rgba(255,255,255,0.60);">
        <span>
          <Icon icon="dianzan" class="mr-2"></Icon>
          <span>{{ keyScheme.sumLikes }}</span>
        </span>
        <span class="ml-3">
          <Icon icon="xiazai" class="mr-2"></Icon>
          <span>{{ keyScheme.download }}</span>
        </span>
      </span>
    </div>
  </a-drawer>
</template>

<script>
import { mapActions } from 'pinia';
import { appStore } from '../../store';
import ShortcutKeyList from '../../components/shortcutKey/ShortcutKeyList.vue';
export default {
  name: "MarketList",
  components: {
    ShortcutKeyList
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
    addPlan(){
      console.log(this.keyScheme)
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
          color: rgba(255,255,255,0.60);
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
