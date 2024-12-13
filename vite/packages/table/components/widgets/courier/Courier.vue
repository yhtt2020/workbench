<template>
  <xt-container
    :header="header"
    v-model:customSize="customData.customSize "
    :envLimit="['guest', 'single', 'offline']"
    :desk="desk"
    :sizeList="sizeList"
    :options="options"
    :customIndex="customIndex"
    :customData="customData"
    :menuList="menuList"
    :env="env"

    ref="cardSlot"
    @delete="deleteCard">
    <div class="flex flex-col w-full h-full">
      <div class="relative flex-1 w-full h-0 courier">
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
            <Empty v-if="displayList.length === 0 " :exampleVisible="true"/>
            <template v-else>
              <vue-custom-scrollbar ref="threadListRef" :settings="outerSettings"
                                    style="height:100%;overflow: hidden;flex-shrink: 0;width: 100%;"
                                    class="mt-2 courier-item">
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
        <teleport to='body'>
          <xt-modal v-if="courierModalVisible" v-model="courierModalVisible" title="" :footer="false"  :header="false" :index="999">
            <LargeCourierDetail @change-route="changeRoute" :route="showCourierDetail?'detail':'list'" :mode="modalMode" @close="courierModalVisible = false;getDbCourier()"/>
<!--            <LogisticsDetail v-else :detail="currentDetail" @close="closeCourierDetail" @back="backAllCoutiers"/>-->
          </xt-modal>
        </teleport>
      </div>
<!--      <SmallCourierModal :show="showSmallDetail" :route="showCourierDetail?'detail':'list'" @close-modal="smallDetailsVisible"/>-->
    </div>


  </xt-container>
  <teleport to='body'>
    <CourierSetting ref="courierSettingRef"/>
  </teleport>
  <AddCourierModal ref="addCourierRef"/>
</template>

<script>
import { Icon as newIcon } from '@iconify/vue'
import { courier } from './lib/mock'
import { courierStore } from '../../../apps/ecommerce/courier.ts'
import { appStore } from '../../../store'
import { mapWritableState, mapActions } from 'pinia'
import { message, Modal as antModal, notification } from 'ant-design-vue'
import grab from './lib/grab'
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
import ui from './lib/courierUI'
import { preHandle, getOrderState } from './lib/courierTool'

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
    openWay:{
      type: String,
      default: "desk"
    }
  },
  data () {
    return {
      settingVisible: false,
      sizeList: [
        {
          value: '2x2',
          name: '2x2',
        },
        {
          value: '4x4',
          name: '4x4',
        },
        {
          value: '4x6',
          name: '4x6',
        },

      ],
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
        single: true
      },
      displayList: [],//显示列表
      autoRefreshTime,
      timer: null
    }
  },
  methods: {
    ...mapActions(courierStore, ['getDbCourier', 'refreshCouriers', 'saveJdOrders']),
    // 自定义删除函数，当添加到导航栏时，不删除卡片
    deleteCard(){
      this.$emit('delete')
    },
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
    },
    // 用于处理状态栏中快递数量的显示
    reload (list) {
      if (this.settings.courierStatus.currentStatus === 'followed') {
        list = list.filter(li => {
          return li.followed
        })
      } else {
        list = list.filter(li => {
          return getOrderState(li) !== 'signed' && getOrderState(li) !== 'canceled'
        })
      }
      return list
    }
  },
  computed: {
    ...mapWritableState(courierStore, ['courierMsgList',
      'orderList',
      'couriersDetailMsg',
      'couriersList',
      'storeInfo', 'currentDetail', 'settings']),
    // 判断当前是否在导航栏，自定义删除
    options () {
      return {
        defaultData: {
          _updateFlag: "24531",
          customSize: this.customData.customSize !== undefined ? this.customData.customSize : '4x4',
        },
        customDel: this.openWay === 'nav' ? true : false,
        cardName: '快递'
      }
    },

    // 判断尺寸大小
    showSize () {
      if (this.customData.customSize) {
        let arr = this.customData.customSize.split('x')
        return {
          width: arr[0],
          height: arr[1],
        }
      }else{
        return {
          width: 4,
          height: 4
        }
      }
    },
    showWay () {
      if (this.showSize.height == 2) {
        return true
      } else {
        return false
      }
    },
    courierMsg () {
      return this.courierMsgList
    },
    refreshInterval () {
      return this.autoRefreshTime.find((item) => {
        return item.value === this.settings.courierRefresh.autoTime
      })
    },
    header(){
      return {
        title:'我的快递',
        // ifyIcon:'fluent:box-16-regular',
        showIcon:"/logo/courier.svg",

        refresh:{
          fn:()=>{
            this.refreshFlag = true
            this.refreshAll().then(()=>{
              console.log(111111)
              this.refreshFlag = false
            })
          },
          tip:'刷新',
          state:false
        }
      }
    }
  },
  watch: {
    'orderList': {
      handler (newVal) {
        this.displayList = preHandle(this.orderList)
        this.displayList = this.displayList.slice(0, 10)
        this.couriersList = this.reload(this.orderList)
      },
      immediate: true
    },
    customSize (newVal, oldVal) {
      this.customData.customSize = newVal
    },
  },
  async mounted () {
    // console.log(this.customData.customSize)
    if(this.customData.customSize === undefined){
      this.customData.customSize = '4x4'
    }
    this.getDbCourier()
    // console.log(this.storeInfo.jd.order.orders)
    window.addEventListener('resize', this.handleResize)
    if (this.storeInfo.jd.order.orders?.length > 0 || this.storeInfo.tb.order?.length > 0) {
      this.autoRefresh()
    }
    this.handleResize()

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

