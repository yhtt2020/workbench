<template>
  <div class="xt-bg pl-6 box h-full" >
    <div class="pr-4 pt-4" :style="showPreview ? 'width:70%' : 'width:100%'" style="height: 100%;display: flex;flex-direction: column">
      <!-- 头部导航 -->
      <div class="flex items-center justify-between" style="height: 96px;">
        <div class="flex">
          <div @click="onBack" class="w-12 h-12 pointer flex items-center rounded-lg justify-center"
            style="background: var(--mask-bg);font-size: 16px;color: var(--primary-text);">
            <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
          </div>
          <div class="box-title no-drag">道具市场</div>
        </div>
        <div class="flex items-center">
          <!-- 头部搜索和下拉列表 -->
          <Search
            :searchValue="inputSearchValue"
            :defaultSelect="sort"
            :sortType="sortType"
            :isFiltrate="true"
            @changeSelect="changeSelect"
            @changeInput="changeInput"
          />
          <div v-if="!showPreview" @click="openPreview" class="px-6 ml-3 flex items-center xt-mask rounded-lg h-12 pointer">
            <Icon icon="zhankai" style="font-size: 1.5em;"></Icon>
            <span class="xt-text ml-3" style="font-size: 16px;">装扮预览</span>
          </div>
        </div>
      </div>
      <div class="flex mt-4 h-full" >
        <!-- 侧边导航 -->
        <NavMenu :list="marketList" :currenIndex="navIndex" @changeNav="updateNavIndex" />
        <!-- 列表内容 -->
        <div class="ml-5 right no-drag h-full"  >
          <Props :selected="sort" :navList="marketList[navIndex].children" @getFrameImage="getFrameImage"></Props>
        </div>
      </div>
    </div>
    <div class="preview" v-if="showPreview">
      <div class="flex items-center justify-between mb-6" style="height: 48px;">
       <div class="flex items-center">
          <div @click="showPreview = false" class="w-12 h-12 pointer flex items-center rounded-lg justify-center"
            style="background: var(--mask-bg);font-size: 16px;color: var(--primary-text);">
            <Icon icon="zhankai" style="font-size: 1.5em;"></Icon>
          </div>
          <span class="xt-text ml-3" style="font-size: 16px;">装扮预览</span>
       </div>
       <div @click="clearExtra" class="w-12 h-12 pointer flex items-center rounded-lg justify-center"
          style="background: var(--mask-bg);font-size: 16px;color: var(--primary-text);">
          <Icon icon="clear" style="font-size: 1.5em;"></Icon>
        </div>
      </div>
      <div class="card half mr-3" style="width:376px;height:600px;background: var(--primary-bg);color: var(--primary-text);padding:0;position: relative">
        <PropPreview :uid="userInfo.uid" :userInfo="userInfo" :frameImage="frameImage"></PropPreview>
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
import Props from '../../components/market/Props.vue';
import PropPreview from '../../components/market/PropPreview.vue';
export default {
  name: "CreativeMarket",
  components: {
    Search,
    NavMenu,
    Props,
    PropPreview
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
        { value: '购买次数', name: '购买次数' },
        { value: '创建时间', name: '创建时间' },
      ],
      inputSearchValue: '',
      marketList: [
        {cname: '头像框',children: []},
        // {cname: '卡面',children: []},
        // {cname: '宠物',children: []},
        // {cname: '主题',children: []},
        // {cname: '道具',children: []},
      ],
      showPreview: true,
      frameImage: ''
    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen','userInfo']),
    ...mapWritableState(frameStore, ['frameData']),
  },
  watch: {
    frameData: {
      deep: true,
      handler(val){
        this.marketList[0].children = val.list
      }
    }
  },
  mounted() {
    this.fullScreen = true
    this.getFrameGoods()
  },
  methods: {
    ...mapActions(frameStore, ['getFrameGoods', 'ensureOrder']),
    changeTab(args) {
      this.tab = args.index
    },
    onBack(){
      this.fullScreen = false
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
    openPreview(){
      this.showPreview = true
    },
    getFrameImage(frameImage){
      this.frameImage = frameImage
      this.showPreview = true
    },
    clearExtra(){
      this.frameImage = ''
    }
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
    display: flex;
    justify-content: space-between;
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
  .right{
    width:100%;
    display: flex;
  }
  .left::-webkit-scrollbar{
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
  .preview{
    width: 413px;
    z-index: 9;
    margin-top: 24px;
    padding: 0 20px 0 16px;
    margin-bottom: 24px;
    border-left: 1px solid var(--divider);
  }
</style>
