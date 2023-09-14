<template>
  <div @resize="updateScroller" class="container flex flex-col xt-text">
    <div class="top-bar">
      <div class="left shrink h-[40px] flex">
        <!-- style="color: var(--primary-text);" -->
        <!-- {{ store.communityInfo }} -->
        <!-- {{ store.communityPost.list }} -->
        <!-- {{ comCards.list[1] }} -->
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
      <div class="right shrink">
        <a-button type="primary" :icon="h(PlusCircleTwoTone)" style="color: var(--primary-text);" @click="visibleModal">
          发布</a-button>
      </div>
      <!-- 发布模态框 -->
      <!-- <a-modal v-if="showPublishModal" title="Basic Modal" @ok="handleOk">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </a-modal> -->
      <publishModal v-if="showPublishModal" :showPublishModal="showPublishModal" @handleOk="modalVisible" />

    </div>

    <!-- <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;"> -->
    <div class="flex justify-center flex-1 " style="height: 0">
      <!-- 左侧卡片区域 -->
      <vue-custom-scrollbar ref="threadListRef" :class="{ 'detail-visible': detailVisible }" class="w-full thread-list"
         :settings="settingsScroller" style="height: 100%;overflow: hidden;flex-shrink: 0; "
        :style="{ width: detailVisible ? '40%' : '70%' }">
        <div class="flex justify-center content">
          <!-- 循环渲染多个 ComCard -->
          <ComCard v-for="(card, index) in comCards.list" :key="index" :cardData="card" @click="showDetail(index)"
            :detailVisible="detailVisible" class="xt-bg"
            :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
          </ComCard>
        </div>
      </vue-custom-scrollbar>
      <!-- <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据"></DataStatu> -->
      <!-- 右侧详情区域 -->
      <vue-custom-scrollbar class="ml-2 rounded-lg thread-detail xt-bg" :key="selectedIndex" v-if="detailVisible"
        :settings="settingsScroller" style="height: 100%;" :style="{ width: detailVisible ? '55%' : '40%' }">
        <div class="h-full detail" v-if="detailVisible">
          <DetailCard :cardData="detailText">
            <template #top-right>
              <CloseCircleOutlined @click="close()" class="text-xl xt-text" />
            </template>
          </DetailCard>
        </div>
      </vue-custom-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, h, onMounted, computed, watch } from 'vue';
import { DownOutlined, CloseCircleOutlined, PlusCircleTwoTone } from '@ant-design/icons-vue';
import ComCard from './com/ComList.vue';
import DetailCard from './com/Detail.vue';
import DataStatu from '../../../table/components/widgets/DataStatu.vue';
import publishModal from './com/publishModal.vue';
import { useCommunityStore } from './community'
import { message } from 'ant-design-vue'
// import {} from 'pinia'
// import communityStore  from './community';
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
const checkMenuList = ref([{
  type: '最近更新',
  order: store.communityPost.create_time
}, {
  type: '最近回复',
  order: store.communityPost.last_post_time

}])
const currentIndex = ref(0)
const checkMenuCurrentIndex = ref(0)
const handleMenuItemClick = (index) => {
  checkMenuCurrentIndex.value = index
  // store.getCommunityPostReply(index+1234,1)
}
const setCurrentIndex = (index) => {
  currentIndex.value = index
  store.getCommunityPost(props.forumId, menuList.value[currentIndex.value].type, checkMenuList.value[currentIndex.value].order)
}
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
  // console.log(val.value);
  // console.log(showPublishModal.value);


}
const visibleModal = () => {
  showPublishModal.value = !showPublishModal.value
}
const comCards = computed(() => {
  return store.communityPost
})
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
  // console.log(selectedIndex)
  // console.log(comCards);

  let tid = store.communityPost.list[index].pay_set.tid ? store.communityPost.list[index].pay_set.tid : store.communityPost.list[index].id
  // console.log(tid);
  await store.getCommunityPostDetail(tid)

  // console.log(store.communityPostDetail.pay_set);



  // store.getCommunityPostDetail()
}
const detailText = computed(() => {
  if (store.communityPostDetail.pay_set === undefined) {
    // console.log(detailStorage);
    detailVisible.value = false
    // console.log(detailVisible.value);
    // message.info('暂无数据')
    return detailStorage
  } else {
    detailStorage = store.communityPostDetail
    return store.communityPostDetail
  }
})

// const pageToggle = computed(() => {
//   if (comCards.list === null) {
//     return false
//   } else {
//     return true
//   }
// })
// if(store.communityPostDetail.pay_set===undefined){
//   message.info('暂无数据')

// }
// console.log(store.communityPostDetail);



// 关闭详情的函数
const close = () => {
  if (detailVisible.value) {
    detailVisible.value = false;
    selectedIndex.value = -1
  }
  updateScroller()
}

onMounted(() => {
  setCurrentIndex(0)
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
      font-family: PingFangSC-Regular;
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
    width: 83px;
    height: 40px;
    margin-right: 24px;

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
      font-family: PingFangSC-Regular;
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
          font-family: PingFangSC-Medium;
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
          font-family: PingFangSC-Regular;
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



  .omit {
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .scroll {
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
