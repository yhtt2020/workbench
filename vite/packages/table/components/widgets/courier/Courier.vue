<template>
  <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList" :env="env"
    ref="cardSlot">
    <template #left-title-icon>
      <div class="icon"
        style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
        <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
      </div>
    </template>
    <div class="flex flex-col w-full" style="height: calc(100% - 30px)">
      <template v-if="!showWay">
        <div class="flex justify-between w-full mt-2" v-if="courierDetailList.length !== 0">
          <div class="xt-text xt-font ">快递筛选</div>
          <div class="flex items-center">
            <span class="mr-2">2023-11-03 11:11更新</span>
            <xt-button :w="22" :h="22"  @click="refreshAll">
              <div class="flex items-center justify-center">
                <newIcon class="xt-text refresh" style=" font-size: 18px;margin-top: 1px;vertical-align: sub;" icon="akar-icons:arrow-clockwise"/>
              </div>
            </xt-button>
          </div>
        </div>
      </template>

      <div class="flex-1 w-full h-0 courier" style="position:relative;">
        <div v-if="isLoading">
          <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%" />
        </div>
        <template v-else>
          <div v-if="showWay">
            <MinEmpty v-if="courierDetailList.length === 0" />
            <MinCourierItem v-else :courier="courierDetailList[0]" @click.stop="viewDeliveryDetails(this.deliveryDetails[0])">
            </MinCourierItem>
          </div>
          <template v-else>
            <Empty v-if="courierDetailList.length === 0" :exampleVisible="true"/>
            <template v-else>
              <vue-custom-scrollbar ref="threadListRef" :key="currentPage" :settings="outerSettings"
                style="height:100%;overflow: hidden;flex-shrink: 0;width: 100%;" class="courier-item">
                <div v-for="(item, index) in courierDetailList">
                  <CourierItem  :key="index" :courier="item" @click.stop="viewDeliveryDetails(item)" />
                  <div v-if="index !== courierDetailList.length - 1" class="divider"></div>
                </div>
                
              </vue-custom-scrollbar>
              <div class="item-content" style="position: absolute;right: 15px;bottom: 30px;width: 40px">

                <xt-button :w="40" :h="40" type="theme" @click="addCourier" class="add-courier">
                  <newIcon class="text-lg "
                    style="vertical-align: sub;font-size: 20px;text-align: center;margin: 10px ;color: rgba(255,255,255,0.85);"
                    icon="fluent:add-16-filled" />
                </xt-button>
              </div>

            </template>
          </template>
        </template>
        <template v-if="allCourierVisible">
          <LargeCourierModal v-if="courierShow" :show="allCourierVisible" @close-modal="changeState" />
          <SmallCourierModal v-else :show="allCourierVisible" @close-modal="changeState" />
        </template>
        <teleport to='body'>
          <xt-modal v-if="showCourierDetail" v-model:visible="showCourierDetail" title="" :isFooter="false" zIndex="9"
            :isHeader="false" :boxIndex="100" :maskIndex="99" @close="showCourierDetail = false">
            <LargeCourierDetail v-if="largeDetailVisible" @close="showCourierDetail = false" />
            <LogisticsDetail v-else :orderNum="orderNum" @close="closeCourierDetail" @back="backAllCoutiers" />
          </xt-modal>
        </teleport>
      </div>
      <SmallCourierModal :show="showSmallDetail" @close-modal="smallDetailsVisible" />
    </div>


  </Widget>
  <teleport to='body'>
    <CourierSetting ref="courierSettingRef" />
  </teleport>
  <AddCourierModal ref="addCourierRef" />
</template>

<script>
import { Icon as newIcon } from '@iconify/vue'
import { courier } from './mock'
import { courierStore } from '../../../store/courier.ts'
import { mapWritableState, mapActions } from 'pinia'
import { message, Modal as antModal , notification } from 'ant-design-vue'
import grab from './grab'

import Modal from '../../Modal.vue'
import Widget from '../../card/Widget.vue'
import CourierItem from './CourierItem.vue'
import MinCourierItem from './MinCourierItem.vue'
import Empty from './Empty.vue'
import MinEmpty from './MinEmpty.vue'
import LargeCourierModal from './courierModal/LargeCourierModal.vue'
import SmallCourierModal from './courierModal/SmallCourierModal.vue'
import LogisticsDetail from './courierModal/content/LogisticsDetail.vue'
import AddCourierModal from './courierModal/AddCourierModal.vue'
import LargeCourierDetail from "./courierModal/content/LargeCourierDetail.vue";
import CourierSetting from './courierModal/CourierSetting.vue';
import _ from 'lodash-es'
export default {
  name: '我的快递',
  components: {
    Widget,
    newIcon,
    CourierItem,
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
  data() {
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
          newIcon: "fluent:add-16-filled",
          title: "添加快递",
          fn: () => {
            this.$refs.addCourierRef.openCourierModel()
          },
        },
        {
          newIcon: 'fluent:box-16-regular',
          title: '全部快递',
          fn: () => {
            this.allCourierVisible = true
          },
        },
        {
          icon: 'shezhi1',
          title: '设置',
          fn: () => { this.$refs.courierSettingRef.openSettingModal(); this.$refs.cardSlot.visible = false }
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
      courierShow: true,
      deliveryDetails: [],
      orderNum: [],
      showCourierDetail: false,
      showSmallDetail: false,
      largeDetailVisible: true,
      env:{
        web: false,
        mobile: false,
        client: false,
        offline:true
      }
    };
  },
  methods: {
    ...mapActions(courierStore, ['getDbCourier', 'refreshCouriers']),
    changeState () {
      this.allCourierVisible = false
    },
    refreshCourier() {
      this.refreshCouriers()
    },
    viewDeliveryDetails(item) {
      this.showCourierDetail = true;
      this.orderNum = item;
      this.viewCourierDetail = item
      // console.log(this.orderNum);
    },
    closeCourierDetail() {
      this.showCourierDetail = false
    },
    handleResize() {
      let windoWidth = window.innerWidth;
      // console.log(windoWidth);
      if (windoWidth > 1200) {
        this.largeDetailVisible = true
        this.courierShow = true;
      } else {
        this.largeDetailVisible = false
        this.courierShow = false;
      }
    },
    refreshAll() {
      // 快递鸟快递信息更新
      this.refreshCouriers()
      message.loading('正在为您更新商城订单')
      if (this.storeInfo.jd.nickname) {
        //京东绑定了
        grab.jd.getOrder()
      }
      if (this.storeInfo.tb.nickname) {
        grab.tb.getOrder((args) => {
          console.log('淘宝结果', args)
          if (args.status === 0 && args.code === 401) {
            notification.info({
              content: '淘宝账号已过期，点击重新绑定。',
              onClick: () => {
                grab.tb.login((args) => {
                  console.log(args, '获取到的订单信息')
                })
              }
            })
          }
        })
        //淘宝绑定了
      }
      //todo 刷新其他订单
    },


    async getOrderDetail(orders) {

      let promises = []
      for (const order of orders) {

        if (order.status === '商品出库') {
          //只检查等待收货的商品
          //仅检查未完成的订单
          let getProcess = new Promise((resolve, reject) => {
            grab.jd.getOrderDetail(order.detailUrl, ({ status, code, data }) => {
              if (status) {
                console.log('成功获得订单详情', data)
                order.detail = {}
                order.detail.expressNo = data.expressNo
                order.detail.traceNodes = data.traceNodes
                order.detail.expressType = data.expressType
                order.detail.updateTime = Date.now()
                resolve(data)
              } else {
                reject({
                  status, code
                })
              }

            })
          })
          promises.push(getProcess)
        }
      }
      message.loading({
        content: '共有' + promises.length + '个订单需要更新物流信息，' + '请稍候…',
        key: 'loadingTip',
        duration: 0
      })

      await Promise.all(promises)
      message.success({
        content: '订单物流信息更新完成。',
        key: 'loadingTip',
        duration: 4
      })
      console.log('更新后的订单', this.storeInfo.jd.order)
    },

    addCourier() {
      this.$refs.addCourierRef.openCourierModel()
    },
    smallDetailsVisible() {
      this.showSmallDetail = false
    },
    backAllCoutiers() {
      this.showSmallDetail = true,
      this.showCourierDetail = false
    }
  },
  computed: {
    ...mapWritableState(courierStore, ["courierMsgList",
      "courierDetailList",
      "couriersDetailMsg",
      "storeInfo", 'viewCourierDetail']),
    // 判断尺寸大小
    showSize() {
      if (this.customData && this.customData.width && this.customData.height) {
        return { width: this.customData.width, height: this.customData.height }
      }
      return this.sizeList[2]
    },
    showWay() {
      if (this.showSize.height === 1) {
        return true
      } else {
        return false
      }
    },
    courierMsg() {
      return this.courierMsgList;
    },
    formattedDate() {
      const year = this.dateNow.getFullYear();
      const month = String(this.dateNow.getMonth() + 1).padStart(2, '0');
      const day = String(this.dateNow.getDate()).padStart(2, '0');
      const hours = String(this.dateNow.getHours()).padStart(2, '0');
      const minutes = String(this.dateNow.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
  },
  async mounted() {
    this.getDbCourier()
    window.addEventListener("resize", this.handleResize)
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
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
.courier-item{
  &::after{
        content:'';
        width: 100%;
        height: 1px;
        background-color: var(--divider);
        margin-top: 6px;
    }
}
.divider{
    width: 100%;
    height: 1px;
    background-color: var(--divider);
    margin-top: 8px;
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

