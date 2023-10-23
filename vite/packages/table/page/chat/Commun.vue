<template>
  <div @resize="updateScroller" class="container flex flex-col xt-text">
    <div class="top-bar">
      <div class="left shrink h-[40px] flex">
        <div class=" h-[40px] xt-bg rounded-lg text-center font-16 mr-3 xt-text-2 pl-1 pr-1" style="line-height: 40px;">
          <span class="mr-1">ID:</span>{{ props.forumId }}
        </div>
        <div class="flex  w-[200px] h-[40px] justify-center xt-bg rounded-lg">
          <div v-for="(item, index) in menuList" :key="index"
            class="w-[64px] h-[32px]  mt-1 mb-1 text-center leading-8 font-16"
            :class="[{ action: currentIndex == index }]" style="cursor: pointer;" @click="setCurrentIndex(index)">{{
              item.name
            }}</div>
        </div>
        <div class="xt-bg w-[115px] h-[40px] text-center ml-3 leading-10 rounded-lg font-16" style="cursor: pointer">
          <a-dropdown trigger="click" placement="bottom"
            overlayStyle="background-color: var(--primary-bg); padding-left:3px ;padding-right:3px; width: 100px;">
            <span class=" ant-dropdown-link" @click.prevent>
              {{ checkMenuList[checkMenuCurrentIndex].type }}
              <DownOutlined class="text-sm" />
            </span>
            <template #overlay>
              <a-menu class="text-center xt-bg">
                <a-menu-item v-for="(item, index) in checkMenuList" :key="index" @click="handleMenuItemClick(index)">
                  <span class="text-center xt-text">{{ item.type }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="flex mr-6 right">
        <!-- <div class="flex items-center"> -->
        <xt-button type="primary"
          style="color: var(--active-bg); width: 83px;height: 40px;background: rgba(80,139,254,0.20);"
          @click="visibleModal">
          <Icon class="pr-1 text-xl xt-theme-text" style="font-size: 22px;vertical-align: sub;margin-right:6px ;" icon="akar-icons:circle-plus-fill" />发布
        </xt-button>
        <a-tooltip  title="刷新" placement="bottom">
          <xt-button class="ml-3 border-0 rounded-md xt-bg pointer " @click="refreshPost"
            style="flex-shrink: 0;width: 40px;height: 40px;">
            <Icon class="text-lg xt-text" style="vertical-align: sub;" icon="akar-icons:arrow-clockwise" />
          </xt-button>
        </a-tooltip>
        <a-tooltip title="前往元社区" placement="bottom">
          <xt-button class="ml-3 border-0 rounded-md xt-bg pointer" @click="goYuan"
            style="flex-shrink: 0;width: 40px;height: 40px;">
            <Icon class="text-lg xt-text" style="vertical-align: sub;" icon="majesticons:open" />
          </xt-button>
        </a-tooltip>


        <!-- </div> -->

      </div>
      <publishModal v-if="showPublishModal" :showPublishModal="showPublishModal" @handleOk="modalVisible"
        :forumId="props.forumId" />

    </div>
    <!-- {{ store.communityPost.count }} -->
    <a-spin tip="Loading..." v-if="refreshFlag" size="large" style=" margin-top: 28%;"></a-spin>
    <div class="flex justify-center flex-auto " style="height: 0;" v-else>
      <!-- 左侧卡片区域 -->
      <vue-custom-scrollbar ref="threadListRef" :key="current" :class="{ 'detail-visible': detailVisible }"
        class="w-full thread-list" :settings="settingsScroller" style="height: 100%;overflow: hidden;flex-shrink: 0; "
        :style="{ width: detailVisible ? '40%' : '70%' }">
        <div class="flex justify-center content">
          <!-- {{ checkMenuList.value[currentIndex.value].order }} -->
          <!-- 循环渲染多个 ComCard -->
          <a-empty v-if="comCards.list?.length === 0" description="暂无内容" image="/img/test/load-ail.png"
            style="margin-top: 30%;"></a-empty>
          <template v-else>
            <ComCard v-for="(card, index) in comCards.list" :key="index" :cardData="card" @click="showDetail(index)"
              :detailVisible="detailVisible" class="xt-bg"
              :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
            </ComCard>
            <a-pagination v-model:current="current" :total="totalPost" simple @change="changePage" class="xt-text-2" />
          </template>

        </div>
      </vue-custom-scrollbar>
      <!-- <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据"></DataStatu> -->
      <!-- 右侧详情区域 -->
      <vue-custom-scrollbar class="ml-2 rounded-lg thread-detail xt-bg" :key="selectedIndex" v-if="detailVisible"
        :settings="settingsScroller" style="height: 100%;" :style="{ width: detailVisible ? '55%' : '40%' }">
        <div class="h-full detail" v-if="detailVisible">
          <DetailCard :cardData="detailText" @closeDetail="closeDetail"></DetailCard>
          <!-- <a-pagination v-model:current="detailCurrent" :total="totalReply" simple @change="changePage" /> -->
        </div>
      </vue-custom-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, computed, watch, onBeforeUpdate, onUpdated } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import ComCard from './com/ComList.vue';
import DetailCard from './com/Detail.vue';
import publishModal from './com/PublishModal.vue';
import { useCommunityStore } from './commun'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Icon } from '@iconify/vue'
import browser from '../../js/common/browser';
const current = ref(1)
// 更新帖子列表
const refreshFlag = ref(false)
const store = useCommunityStore();
const props = defineProps({
  forumId: {
    type: Number,
    required: false
  }
})
const menuList = ref([
  {
    name: '全部',
    type: 'all'
  }, {
    name: '热门',
    type: 'hot'
  }, {
    name: '精华',
    type: 'essence'
  }])
const comCards = computed(() => {
  return store.communityPost
})

const checkMenuList = ref([{
  type: '最近更新',
  order: 'create_time',
}, {
  type: '最近回复',
  order: 'reply_time'

}])

const currentIndex = ref(0)
const checkMenuCurrentIndex = ref(0)
// 选择最近更新与最近回复
const handleMenuItemClick = (index) => {
  checkMenuCurrentIndex.value = index
  // store.getCommunityPostReply(index+1234,1)
  store.getCommunityPost(props.forumId, current.value, menuList.value[currentIndex.value].type, checkMenuList.value[checkMenuCurrentIndex.value].order)
  // console.log(menuList.value[currentIndex.value].type,checkMenuList.value[checkMenuCurrentIndex.value].order);
}
// 选择全部，热门的内容
const setCurrentIndex = (index) => {
  currentIndex.value = index
  detailVisible.value = false
  current.value = 1
  store.getCommunityPost(
    props.forumId,
    current.value,
    menuList.value[currentIndex.value].type,
    checkMenuList.value[checkMenuCurrentIndex.value].order)
  // let tid = store.communityPost.list[index].pay_set.tid ? store.communityPost.list[index].pay_set.tid : store.communityPost.list[index].id
  // if (detailVisible.value === true) {
  //   store.getCommunityPostDetail(tid)
  // }

}
const goYuan = () => {
  browser.openInUserSelect(`https://s.apps.vip/forum?id=${props.forumId}`)
}
const refreshPost = () => {
  refreshFlag.value = true
  setTimeout(async () => {
    await store.getCommunityPost(props.forumId, current.value, menuList.value[currentIndex.value].type, checkMenuList.value[currentIndex.value].order)
    refreshFlag.value = false
  });

}
const changePage = (page) => {
  refreshFlag.value = true
  detailVisible.value = false
  current.value = page
  store.getCommunityPost(props.forumId, current.value, menuList.value[currentIndex.value].type, checkMenuList.value[currentIndex.value].order)
  refreshFlag.value = false
}
const totalPost = computed(() => {
  return store.communityPost.count
})
//当前选中的详情帖子的索引
let selectedIndex = ref(-1)
const settingsScroller = reactive({
  useBothWheelAxes: true,
  swipeEasing: true,
  suppressScrollY: false,
  suppressScrollX: true,
  wheelPropagation: true,
});

watch(() => props.forumId, (newValue) => {
  setCurrentIndex(currentIndex.value)
})
//
const showPublishModal = ref(false)
const modalVisible = (val) => {
  showPublishModal.value = val.value
}
const visibleModal = () => {
  showPublishModal.value = !showPublishModal.value
}

const threadListRef = ref()
function updateScroller() {
  // console.log(threadListRef)
  threadListRef.value.update()
}
// 控制显示状态和选中状态的变量
const detailVisible = ref(false);
let detailStorage
// 切换选中状态的函数
const showDetail = async (index) => {
  // console.log(index, '点钟了')
  // 切换显示状态
  detailVisible.value = true;
  // 切换选中状态
  selectedIndex.value = index;
  let tid = store.communityPost.list[index].pay_set.tid ? store.communityPost.list[index].pay_set.tid : store.communityPost.list[index].id
  // console.log(tid);
  await store.getCommunityPostDetail(tid)
  await store.getCommunityPostReply(tid)
}
const detailText = computed(() => {
  if (store.communityPostDetail.pay_set === undefined) {
    // console.log(detailStorage);
    detailVisible.value = false
    return detailStorage
  } else {
    detailStorage = store.communityPostDetail
    return store.communityPostDetail
  }
})
// 关闭详情页
const closeDetail = (value) => {
  if (detailVisible.value) {
    detailVisible.value = value;
    selectedIndex.value = -1
  }
  updateScroller()
}
onBeforeMount(async () => {
  NProgress.start()
  NProgress.configure({ showSpinner: false });
  await NProgress.configure({ parent: '.container' })
})
onMounted(() => {
  // setCurrentIndex(0)
  store.getCommunityPost(props.forumId)
  NProgress.done()
})
onBeforeUpdate(() => {
  NProgress.start()
  // NProgress.configure({ showSpinner: false });
})
onUpdated(() => {
  NProgress.done()
  // NProgress.configure({ showSpinner: false });
})
</script>
<style lang='scss' scoped>
@media screen and (max-width: 1200px) {
  .thread-list {
    width: 100% !important;
    margin-left: 10px;
    margin-right: 10px;

  }

  .thread-detail {
    margin-left: 10px;
    width: 100% !important;
    margin-right: 10px;
  }

  .detail-visible {
    display: none;
  }
}

.container {
  width: 100%;
  height: 100%;

  .top-bar {
    width: 100%;
    height: 40px;
    margin-top: 12px;
    margin-bottom: 12px;
    margin-left: 12px;
    // margin-right: 12px;
    display: flex;
    justify-content: space-between;
    //当屏幕最大宽度为767px

    .font-16 {
      font-size: 16px;
      font-weight: 400;
    }

    .action {
      background: var(--active-bg);
      border-radius: 8px;
      cursor: pointer;
      width: 64px;
      height: 32px;
      border-left: 0px;
      padding: 0px;
      margin-right: 0px;
      text-align: center;
      color: var(--active-text);
      border: none;
    }

  }

  .right {

    // margin-right: 24px;

    :deep(.ant-btn) {
      width: 100%;
      height: 100%;
      background: rgba(80, 139, 254, 0.20);
      border-radius: 10px;
    }
  }



  .content {
    // max-width: 40%;
    // height: 550px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;


    // overflow: scroll;
    .card-content {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.85);
      text-align: justify;
      line-height: 22px;
      font-weight: 400;
    }

    .se-content {
      display: flex;

      .left {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        margin-right: 12px;
      }

      .right {
        .title {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          text-align: justify;
          line-height: 22px;
          font-weight: 500;
          white-space: pre-wrap;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .context {
          margin-top: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.60);
          text-align: justify;
          line-height: 22px;
          font-weight: 400;

        }
      }
    }
  }

  .select {
    background-color: rgba(80, 139, 254, 0.20);
  }

  #nprogress .bar {
    background: #66B1FF !important;
    height: 10px !important;
  }


  .omit {
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  :deep(.ant-pagination-simple .ant-pagination-item-link) {
    color: var(--secondary-text) !important;
  }

  .scroll {
    &::-webkit-scrollbar {
      display: none;
    }
  }
}</style>
