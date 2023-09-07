<template>
  <div @resize="updateScroller" class="container flex flex-col xt-text">
    <div class="top-bar">
      <div class="left shrink h-[40px] flex">
        <!-- style="color: var(--primary-text);" -->
        <div class="flex  w-[200px] h-[40px] justify-center xt-bg rounded-lg">
          <div v-for="(item, index) in menuList" :key="index"
            class="w-[64px] h-[32px]  mt-1 mb-1 text-center leading-8 font-16"
            :class="[{ action: currentIndex == index }]" style="cursor: pointer;" @click="setCurrentIndex(index)">{{ item
            }}</div>
        </div>
        <div class="xt-bg w-[115px] h-[40px] text-center ml-3 leading-10 rounded-lg font-16" style="cursor: pointer">
          <a-dropdown trigger="click" placement="bottom"
            overlayStyle="background-color: var(--primary-bg); padding-left:3px ;padding-right:3px; width: 100px;">
            <span class=" ant-dropdown-link" @click.prevent>
              {{ checkMenuList[checkMenuCurrentIndex] }}
              <DownOutlined class="text-sm" />
            </span>
            <template #overlay>
              <a-menu class="text-center xt-bg">
                <a-menu-item v-for="(item, index) in checkMenuList" :key="index" @click="handleMenuItemClick(index)">
                  <span class="text-center xt-text">{{ item }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="right shrink">
        <a-button type="primary" :icon="h(PlusCircleFilled)" style="color: var(--primary-text);">发布</a-button>
      </div>
    </div>

    <!-- <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;"> -->
    <div class="flex justify-center flex-1" style="height: 0">
      <!-- 左侧卡片区域 -->
      <vue-custom-scrollbar ref="threadListRef" :class="{ 'detail-visible': detailVisible }" class="thread-list"
        :settings="settingsScroller" style="height: 100%;    overflow: hidden;"
        :style="{ width: detailVisible ? '40%' : '60%' }">
        <div class="flex justify-center content">
          <!-- 循环渲染多个 ComCard -->
          <ComCard v-for="(card, index) in comCards" :key="index" :cardData="card" @click="showDetail(index)"
            :detailVisible="detailVisible" class="xt-bg"
            :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
          </ComCard>
        </div>
      </vue-custom-scrollbar>
      <!-- 右侧详情区域 -->
      <vue-custom-scrollbar class="ml-2 rounded-lg thread-detail xt-bg" :key="selectedIndex" v-if="detailVisible"
        :settings="settingsScroller" style="height: 100%;" :style="{ width: detailVisible ? '55%' : '40%' }">
        <div class="h-full ml-3 detail" v-if="detailVisible">
          <DetailCard :cardData="comCards[selectedIndex]">
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
import { ref, reactive, nextTick, h, computed, watch, getCurrentInstance } from 'vue';
import { DownOutlined, PlusCircleFilled, CloseCircleOutlined } from '@ant-design/icons-vue';
import ComCard from './com/ComList.vue';
import DetailCard from './com/Detail.vue';
const menuList = ref(['全部', '热门', '精华'])
const checkMenuList = ref(['最近更新', '最近回复'])
const currentIndex = ref(0)
const checkMenuCurrentIndex = ref(0)
const handleMenuItemClick = (index) => {
  checkMenuCurrentIndex.value = index
}
const setCurrentIndex = (index) => {
  currentIndex.value = index
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

// 定义 ComCard 的数据数组，每个元素都包含内容和点击状态
const comCards = ref([
  {
    content: {
      title: '6.3.3版本测试体验版，欢迎大家下载体验。主要对聊天功能进行了加强。如何加入团队？开启聊天功能，设置-》快捷开关-》启用聊天搜索加入群聊，给大家一个体验群ID：@TGS#2QXE7QDNI',
      context: ''
    },
  },
  {
    content: {
      title: '各位工作台的小伙伴们大家好。由于近期我们的服务器受到一些来自印度？海外的不明IP攻击。主要是攻击了我们产品站www.apps.vip。',
      context: ''
    },
    data: {
      img: ['https://ts1.cn.mm.bing.net/th?id=ORMS.ee894d967b3d81162540134424ce96e5&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1&p=0',
        'https://tse1-mm.cn.bing.net/th/id/OIP-C.X7wB1GrLLb9az8I04ePzZwHaLH?w=203&h=304&c=7&r=0&o=5&dpr=1.1&pid=1.7',
        'https://ts1.cn.mm.bing.net/th?id=ORMS.eabeec2ac6b24658735f4528f013f55d&pid=Wdp&w=612&h=304&qlt=90&c=1&rs=1&dpr=1&p=0'],
    }
  },
  {
    content: {
      title: '8月9日，近期开发内容日志：桌面市场、超级工具箱、待办.经历了连续的几天的服务器震荡。',
      context: '目前我们已经基本稳定了服务器的表现。接下来应该会更加稳定。阿皮有话说：由…'
    },
    data: {
      img: ['https://ts4.cn.mm.bing.net/th?id=ORMS.69f3f16b106791e0f42b6f86cae85a80&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.5&p=0'],
    }
  },
  {
    content: {
      title: '8月9日，近期开发内容日志：桌面市场、超级工具箱、待办.经历了连续的几天的服务器震荡。',
      context: '目前我们已经基本稳定了服务器的表现。接下来应该会更加稳定。阿皮有话说：由…'
    },
    data: {
      video: ['https://vodpub1.v.news.cn/original/20210426/61ccdd548e144eed9b4689968bc05430.mp4']
    }
  },
]);
const threadListRef = ref()
function updateScroller() {
  // console.log(threadListRef)
  threadListRef.value.update()
}
// 控制显示状态和选中状态的变量
const detailVisible = ref(false);

// 切换选中状态的函数
const showDetail = (index) => {
  // console.log(index, '点钟了')
  // 切换显示状态
  detailVisible.value = true;
  // 切换选中状态
  selectedIndex.value = index;
  // console.log(selectedIndex)
};

// 关闭详情的函数
const close = () => {
  if (detailVisible.value) {
    detailVisible.value = false;
    selectedIndex.value = -1
  }
  updateScroller()
}
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
}</style>
