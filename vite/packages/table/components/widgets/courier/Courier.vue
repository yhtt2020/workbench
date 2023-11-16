<template>
  <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList"
          :env="env"
          ref="cardSlot">
    <template #left-title-icon>
      <div class="icon"
           style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
        <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
      </div>
    </template>
    <div style="position: absolute;top: 14px;left: 120px;">
      <xt-button :w="22" :h="22" @click="refreshAll" style="background-color: transparent !important;">
        <div class="flex items-center justify-center">
          <newIcon class="xt-text refresh" style=" font-size: 18px;margin-top: 1px;vertical-align: sub;"
                   icon="akar-icons:arrow-clockwise"/>
        </div>
      </xt-button>
    </div>
    <div class="flex flex-col w-full" style="height: calc(100% - 12px)">
      <!-- <template v-if="!showWay"> -->
      <!-- <div class="flex justify-between w-full mt-2" v-if="courierDetailList.length !== 0">
          <div class="xt-text xt-font ">快递筛选</div>
          <div class="flex items-center">
            <span class="mr-2">2023-11-03 11:11更新</span>

          </div>
        </div> -->
      <!-- </template> -->

      <div class="flex-1 w-full h-0 courier" style="position:relative;">
        <div v-if="isLoading">
          <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%"/>
        </div>
        <template v-else>
          <div v-if="showWay">
            <MinEmpty v-if="displayList.length === 0"/>
            <MinCourierItem v-else :courier="displayList[0]"
                            @click.stop="showDetail(displayList[0])">
            </MinCourierItem>
          </div>
          <template v-else>
            <Empty v-if="displayList.length === 0" :exampleVisible="true"/>
            <template v-else>
              <vue-custom-scrollbar ref="threadListRef" :settings="outerSettings"
                                    style="height:100%;overflow: hidden;flex-shrink: 0;width: 100%;"
                                    class="courier-item mt-2">
                <div v-for="(item, index) in displayList">
                  <ListItem :no-bg="true" :item="item" @goDetail="showDetail(item)"></ListItem>
                  <div v-if="index !== displayList.length - 1" class="divider"></div>
                </div>

              </vue-custom-scrollbar>
              <div class="item-content" style="position: absolute;right: 15px;bottom: 0px;width: 40px">

                <xt-button :w="40" :h="40" type="theme" @click="addCourier" class="add-courier">
                  <newIcon class="text-lg "
                           style="vertical-align: sub;font-size: 20px;text-align: center;margin: 10px ;color: rgba(255,255,255,0.85);"
                           icon="fluent:add-16-filled"/>
                </xt-button>
              </div>

            </template>
          </template>
        </template>
<!--        <template v-if="allCourierVisible">-->
<!--          <LargeCourierModal :route="showCourierDetail?'detail':'list'" :mode="modalMode" :show="courierModalVisible" @close-modal="changeState"/>-->
<!--&lt;!&ndash;          //<SmallCourierModal v-else :show="allCourierVisible" @close-modal="changeState"/>&ndash;&gt;-->
<!--        </template>-->
        <teleport to='body'>
          <xt-modal v-if="courierModalVisible" v-model:visible="courierModalVisible" title="" :isFooter="false" zIndex="9"
                    :isHeader="false" :boxIndex="100" :maskIndex="99">
            <LargeCourierDetail @change-route="changeRoute" :route="showCourierDetail?'detail':'list'" :mode="modalMode" @close="courierModalVisible = false;getDbCourier()"/>
<!--            <LogisticsDetail v-else :detail="currentDetail" @close="closeCourierDetail" @back="backAllCoutiers"/>-->
          </xt-modal>
        </teleport>
      </div>
<!--      <SmallCourierModal :show="showSmallDetail" :route="showCourierDetail?'detail':'list'" @close-modal="smallDetailsVisible"/>-->
    </div>


  </Widget>
  <teleport to='body'>
    <CourierSetting ref="courierSettingRef"/>
  </teleport>
  <AddCourierModal ref="addCourierRef"/>
</template>

<script>
import { Icon as newIcon } from '@iconify/vue'
import { courier } from './mock'
import { courierStore } from '../../../apps/ecommerce/courier.ts'
import { appStore } from '../../../store'
import { mapWritableState, mapActions } from 'pinia'
import { message, Modal as antModal, notification } from 'ant-design-vue'
import grab from './grab'
import ListItem from './ListItem.vue'
import Modal from '../../Modal.vue'
import Widget from '../../card/Widget.vue'
import MinCourierItem from './MinCourierItem.vue'
import Empty from './Empty.vue'
import MinEmpty from './MinEmpty.vue'
import LargeCourierModal from './courierModal/LargeCourierModal.vue'
import SmallCourierModal from './courierModal/SmallCourierModal.vue'
import LogisticsDetail from './courierModal/content/LogisticsDetail.vue'
import AddCourierModal from './courierModal/AddCourierModal.vue'
import LargeCourierDetail from './courierModal/content/LargeCourierDetail.vue'
import CourierSetting from './courierModal/CourierSetting.vue'

import { autoRefreshTime } from './courierModal/modalMock'
import ui from './courierUI'
import { preHandle } from './courierTool'

export default {
  name: '我的快递',
  components: {
    ListItem,
    Widget,
    newIcon,
    MinCourierItem,
    Empty,
    MinEmpty,
    LargeCourierModal,
    SmallCourierModal,
    LogisticsDetail,
    AddCourierModal,
    Modal,
    CourierSetting,
    LargeCourierDetail
  },
  props: {
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
  data () {
    return {
      settingVisible: false,
      sizeList: [
        {
          title: '2x2',
          height: 1,
          width: 1,
          name: '2x2',
        },
        {
          title: '4x4',
          height: 2,
          width: 2,
          name: '4x4',
        },
        {
          title: '4x6',
          height: 3,
          width: 2,
          name: '4x6',
        },

      ],
      options: {
        className: 'card double',
        title: '我的快递',
        icon: '',
        type: 'Courier',
      },
      menuList: [
        {
          newIcon: 'fluent:add-16-filled',
          title: '添加快递',
          fn: () => {
            this.$refs.addCourierRef.openCourierModel()
          },
        },
        {
          newIcon: 'fluent:box-16-regular',
          title: '全部快递',
          fn: () => {
            this.showCourierDetail=false
            this.courierModalVisible = true
          },
        },
        {
          icon: 'shezhi1',
          title: '设置',
          fn: () => {
            this.$refs.courierSettingRef.openSettingModal()
            this.$refs.cardSlot.visible = false
          }
        },

      ],
      courierList: courier,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      isLoading: false,
      allCourierVisible: false,
      modalMode: 'large',
      deliveryDetails: [],
      showCourierDetail: false,//显示详情
      showSmallDetail: false,
      largeDetailVisible: true,
      courierModalVisible:false,//显示模态弹窗
      env: {
        web: false,
        mobile: false,
        client: false,
        offline: true
      },
      displayList: [],//显示列表
      autoRefreshTime,
      timer: null
    }
  },
  methods: {
    ...mapActions(courierStore, ['getDbCourier', 'refreshCouriers', 'saveJdOrders']),
    changeState () {
      this.allCourierVisible = false
      this.getDbCourier()
    },
    changeRoute(route){
      this.showCourierDetail=(route==='detail')
    },
    refreshCourier () {
      this.refreshCouriers()
    },
    showDetail (item) {
      this.currentDetail = item
      this.courierModalVisible = true
      this.showCourierDetail=true
      // console.log(this.currentDetail);
    },
    closeCourierDetail () {
      this.courierModalVisible = false
    },
    handleResize () {
      let windowWidth = window.innerWidth
      // console.log(windoWidth);
      if (windowWidth > 1200) {
        this.largeDetailVisible = true
        this.modalMode = 'large'
      } else {
        this.largeDetailVisible = false
        this.modalMode = 'small'
      }
    },
    refreshAll: ui.refreshAll,

    addCourier () {
      this.$refs.addCourierRef.openCourierModel()
    },
    smallDetailsVisible () {
      this.showSmallDetail = false
    },
    backAllCoutiers () {
      this.showSmallDetail = true,
        this.showCourierDetail = false
    },
    autoRefresh () {
      if (this.settings.courierRefresh.autoRefresh) {
        this.timer = setInterval(() => {
          console.log('刷新立碑')
          ui.refreshAll(false)
        }, this.refreshInterval?.type)//this.refreshTimes[0].type)
      }
    }
  },
  computed: {
    ...mapWritableState(courierStore, ['courierMsgList',
      'orderList',
      'couriersDetailMsg',
      'storeInfo', 'currentDetail', 'settings']),

    // 判断尺寸大小
    showSize () {
      if (this.customData && this.customData.width && this.customData.height) {
        return { width: this.customData.width, height: this.customData.height }
      }
      return this.sizeList[2]
    },
    showWay () {
      if (this.showSize.height === 1) {
        return true
      } else {
        return false
      }
    },
    courierMsg () {
      return this.courierMsgList
    },
    // refreshTime() {
    //   switch (this.settings.courierRefresh.autoTime) {
    //     case '10分钟':
    //       return 600000
    //       break;
    //     case '30分钟':
    //       return 1800000
    //       break;
    //     case '1小时':
    //       return 3600000

    //       break;
    //     case '2小时':
    //       return 7200000
    //       break;

    //     default:
    //       return 1800000
    //       break;
    //   }
    // },
    refreshInterval () {
      return this.autoRefreshTime.find((item) => {
        return item.value === this.settings.courierRefresh.autoTime
      })
    }
  },
  watch: {
    'orderList': {
      handler (newVal) {
        this.displayList = preHandle(this.orderList)
        this.displayList = this.displayList.slice(0, 10)
      },
      immediate: true
    }
  },
  async mounted () {
    // console.log(this.courierDetailList)
    this.getDbCourier()
    // console.log(this.storeInfo.jd.order.orders)
    window.addEventListener('resize', this.handleResize)
    if (this.storeInfo.jd.order.orders?.length > 0 || this.storeInfo.tb.order?.length > 0) {
      this.autoRefresh()
    }

  },

  beforeDestroy () {
    console.log('xiezai')
    window.removeEventListener('resize', this.handleResize)
    clearInterval(this.timer)
  },

}
</script>

<style lang="scss" scoped>
// .refresh {
//   // background-color: var(--primary-bg);

//   &:hover {
//     // background-color: var(--secondary-bg);
//   }
// }
.courier-item {
  &::after {
    content: '';
    width: 100%;
    height: 1px;
    background-color: var(--divider);
    margin-top: 6px;
  }
}

.divider {
  width: 100%;
  height: 1px;
  background-color: var(--divider);
  margin-top: 8px;

  margin-bottom: 8px;
}

.courier {
  .add-courier {
    display: none;
  }

  &:hover {
    .add-courier {
      display: block;
    }
  }
}
</style>

