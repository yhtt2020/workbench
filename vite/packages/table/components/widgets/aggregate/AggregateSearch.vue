<template>
  <Widget :editing="editing" :sizeList="bottomSizeList" :customData="customData" :customIndex="customIndex" :desk="desk" :options="options"
    :menuList="gameMiddleBare" ref="aggregateSearchSlot">
    <div class="flex items-center justify-center w-full p-2 mt-8 mb-3 rounded-xl pointer"
      style="border: 1px solid var(--divider); background: var(--secondary-bg);" @click="enterSearchEngine">
      <div class="flex items-center justify-center" style="width: 20px;height:20px;">
        <Icon :icon="aggInputValue" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
      </div>
      <a-input placeholder="搜索" :bordered="false" @change="enterSearchEngine" class="search"></a-input>
    </div>

    <div class="flex">
      <template v-if="showSize.width === 1">
        <div v-for="(item, index) in  aggList.slice(0, 3)" :key="item.id" @click="clickSearchItem(index)">
          <div class="flex rounded-xl active-button pointer items-center justify-center mr-2.5 h-11" v-if="index !== 0"
            style="background: var(--secondary-bg);" :style="showSize.width === 1 ? { width: '92px' } : { width: '113px' }">
            <div class="flex items-center justify-center" style="width: 20px;height:20px;">
              <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
            </div>
            <span class="ml-2">{{ item.title }}</span>
          </div>
        </div>
      </template>


      <template v-else>
        <div v-for="(item, index) in aggList.slice(0, 5)" @click="clickSearchItem(index)">
          <div class="flex rounded-xl active-button pointer items-center justify-center mr-2.5 h-11" v-if="index !== 0"
            style="background: var(--secondary-bg);" :style="showSize.width === 2 ? { width: '113px' } : { width: '92px' }">
            <div class="flex items-center justify-center" style="width: 20px;height:20px;">
              <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
            </div>
            <span class="ml-2">{{ item.title }}</span>
          </div>
        </div>
      </template>


      <div class="flex items-center justify-center w-11 h-11 active-button rounded-xl pointer"
        style="background: var(--secondary-bg);" @click="aggSearchShow = true">
        <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
  </Widget>


  <a-drawer :width="500" title="设置" placement="right" v-model:visible="aggSearchShow" @close="aggSearchShow = false">
    <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
      <div class="primary-title" style="color: var(--primary-text);">搜索引擎</div>
      <div class="mt-2 mb-6 secondary-title" style="color: var(--secondary-text);">长按拖拽排序，最多支持在卡片上的展示5个搜索引擎</div>
      <AggregateSearchDrawer @setSortedList="setSortedList" :drawerList="aggList"></AggregateSearchDrawer>
      <div class="mb-6 primary-title " style="color: var(--primary-text);">链接打开方式</div>
      <XtTab style="height: 52px" boxClass="p-1 xt-bg-2" :list="linkType" v-model="customData.sortType">
      </XtTab>
    </vue-custom-scrollbar>
  </a-drawer>


  <teleport to="body">
    <Modal v-if="searchVisible" v-model:visible="searchVisible" :blurFlag="true">
      <AggregateSearchFullScreen :list="aggList" :listId="openId" :urlType="customData.sortType">
      </AggregateSearchFullScreen>
    </Modal>
  </teleport>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia';
import { cardStore } from '../../../store/card'

import Widget from "../../card/Widget.vue";
import Modal from "../../Modal.vue";
import AggregateSearchFullScreen from "./AggregateSearchFullScreen.vue";
import AggregateSearchDrawer from "./AggregateSearchDrawer.vue";

import { AggregateList } from "../../../js/data/searchData";
import _ from 'lodash-es'

export default {
  components: {
    Widget,
    Modal,
    AggregateSearchFullScreen,
    AggregateSearchDrawer
  },
  props: {
    editing:{
      type:Boolean,
    },
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => { },
    },
    desk: {
      type: Object,
    },
  },

  data() {
    return {
      options: {
        className: 'card small',
        title: '聚合搜索',
        icon: 'sousuo1',
        type: 'search',
      },

      aggSearchShow: false, // 控制右侧抽屉显示
      searchVisible: false, // 显示模态弹窗
      AggregateList, // 没有排序过的聚合搜索数据

      bottomSizeList: [{ title: '2x2', width: 1, height: 1, name: '1x1' }, { title: '4x2', width: 2, height: 1, name: '2x1' }], // 底部设置中尺寸大小切换
      gameMiddleBare: [{ icon: 'shezhi1', title: '设置', fn: () => { this.aggSearchShow = true; this.$refs.aggregateSearchSlot.visible = false } }],

      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },

      linkType: [  // 设置中打开方式类型
        { name: '工作台内打开', value: 'work' },
        { name: '想天浏览器', value: 'thisky' },
        { name: '系统默认浏览器', value: 'system' }
      ],
      defaultLink: this.updateLink,

      openId: ''  // 根据卡片外部的id进行弹窗内搜索引擎的锁定
    }
  },

  computed: {
    aggList() {
      if (this.customData && this.customData.sortList) {
        return this.customData.sortList
      } else {
        return this.AggregateList
      }
    },
    showSize() {
      if (this.customData && this.customData.width && this.customData.height) {
        return { width: this.customData.width, height: this.customData.height }
      }
      return this.bottomSizeList[0]
    },
    aggInputValue() {
      return this.aggList[0].icon
    },
  },

  mounted() {
    if (this.customData.sortType === undefined) {
      let setData = {};
      setData.sortType = 'work'; // 初始化分组名称
      this.updateCustomData(this.customIndex, setData, this.desk);
    }
  },

  methods: {
    setSortedList(arrList) { // 获取拖拽排序后数据
      this.customData.sortList = arrList
    },
    ...mapActions(cardStore, ['updateCustomData']),
    enterSearchEngine() {  // 点击展开弹窗
      this.searchVisible = true
      this.openId = 0
    },

    clickSearchItem(index) { // 点击选中打开
      this.searchVisible = true
      this.openId = index
    },
  }
}
</script>

<style lang="scss" scoped>
.primary-title {

  font-size: 16px;
  font-weight: 500;
}

.secondary-title {

  font-size: 14px;
  font-weight: 400;
}

:deep(.search){
  &::placeholder{
    color: var(--secondary-text);
  }
}

</style>
