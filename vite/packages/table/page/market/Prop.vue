<template>
  <div class="xt-bg px-6 box">
    <!-- 头部导航 -->
    <div class="flex items-center justify-between" style="height: 96px;">
      <div class="flex">
        <div @click="onBack" class="w-11 h-11 pointer flex items-center rounded-lg justify-center" 
          style="background: var(--mask-bg);font-size: 16px;color: var(--primary-text);">
          <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
        </div>
        <div class="box-title no-drag">道具市场</div>
      </div>
      <div class="flex">
        <!-- 头部搜索和下拉列表 -->
        <Search 
          :searchValue="inputSearchValue"
          :defaultSelect="sort"
          :sortType="sortType"
          :isFiltrate="true"
          @changeSelect="changeSelect"
          @changeInput="changeInput"
        />
      </div>
    </div>
    <div class="flex" style="height: 90%;">
      <!-- 侧边导航 -->
      <NavMenu :list="marketList" :currenIndex="navIndex" @changeNav="updateNavIndex" />
      <!-- 列表内容 -->
      <div class="ml-5 right no-drag" style="width:100%;height:90%;overflow: auto;">
        <!-- <MarketList :selected="sort" :navList="marketList[navIndex].children"></MarketList> -->
      </div>
    </div>
  </div>
</template>

<script>
import Search from '../../components/Search.vue'
import NavMenu from '../../components/NavMenu.vue'
import { mapActions, mapWritableState } from "pinia";
import { appStore } from '../../store';
import { frameStore } from '../../store/avatarFrame'
export default {
  name: "CreativeMarket",
  components: {
    Search,
    NavMenu
  },
  data() {
    return {
      tab: '',
      gallery: false,
      select: 0,
      navIndex: 0,
      sort: '综合排序',
      sortType: [
        { value: '综合排序', name: '综合排序' },
        { value: '下载次数', name: '下载次数' },
        { value: '更新时间', name: '更新时间' },
      ],
      inputSearchValue: '',
      
    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
    ...mapWritableState(frameStore, ['frameData']),
    frameList () {
      const data = this.frameData.list
      return data
    },
  },
  mounted() {
    this.fullScreen = true
    console.log(this.frameList)
  },
  methods: {
    changeTab(args) {
      this.tab = args.index
    },
    onBack(){
      this.$router.go(-1)
    },
    updateNavIndex({index}){
      this.navIndex = index
    },
    changeSelect(event){
      // console.log('选择下拉',event)
      this.sort = event
    },
    changeInput(event){
      // console.log('输入框',event)
    },
  },
}
</script>
<style lang="scss" scoped>
  .box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--primary-bg);
    box-sizing: border-box;
  }
  .left {
      height: 95%;
      width: 140px;
      overflow: auto;
      padding-bottom: 40px;
      .nav {
        width: 112px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-bottom:12px;
        font-size: 16px;
      }

      .active {
        background: var(--mask-bg);

      }
    }
    .left::-webkit-scrollbar,
    .right::-webkit-scrollbar {
      display: none;
    }
  .box-title{
    display: flex;
    align-items: center;
    margin-left: 16px;
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text);
  }
</style>
