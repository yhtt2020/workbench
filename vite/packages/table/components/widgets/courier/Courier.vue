<template>
  <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList"
    ref="cardSlot">
    <template #left-title-icon>
      <div class="icon"
        style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
        <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
      </div>
    </template>
    <div class="flex flex-col h-full">
      <div  class="relative mt-2">
        <div>快递筛选</div>
        <div  style="position: absolute;right: 10px;top: 0px;" @click="refreshAll"
             class="flex pointer" v-if="courierDetailList.length > 0">
          <div class="mr-2">2023-11-03 11:11更新</div>
          <xt-button :w="22" :h="22" @click="refreshCourier" class="refresh">
            <newIcon class="xt-text-2 " style=" font-size: 18px;margin-top: 1px;vertical-align: sub;"
                     icon="akar-icons:arrow-clockwise"/>
          </xt-button>
        </div>
      </div>
        <div v-if="showWay">
          <MinEmpty v-if="courierDetailList.length === 0"  />
          <MinCourierItem v-else :courier="courierDetailList[0]" @click="viewDeliveryDetails(this.deliveryDetails[0])">
          </MinCourierItem>
        </div>
        <template v-else>
            <Empty v-if="courierDetailList.length === 0" :example-visible="true"/>
            <template v-else>
              <vue-custom-scrollbar ref="threadListRef" :key="currentPage" :settings="outerSettings"
                                    style="height: calc(100% - 45px) ;overflow: hidden;flex-shrink: 0;width: 100%;">
                <CourierItem v-for="(item, index) in courierDetailList" :key="index" :courier="item"
                             @click="viewDeliveryDetails(item)"/>
              </vue-custom-scrollbar>
              <div class="item-content" style="position: absolute;right: 24px;bottom: 10px;width: 40px">
                <!-- <xt-button @click="bindTb" :w="120" :h="40" type="theme" class="mr-2 "
                >
                  <newIcon class="text-lg xt-text "
                           style="vertical-align: middle;font-size: 20px;text-align: center;margin: 5px ;"
                           icon="fluent:add-16-filled"/>
                  绑定淘宝
                </xt-button> -->

                <xt-button :w="40" :h="40" type="theme" @click="addCourier" class="add-courier">
                  <newIcon class="text-lg " style="vertical-align: sub;font-size: 20px;text-align: center;margin: 10px ;color: rgba(255,255,255,0.85);"
                           icon="fluent:add-16-filled"/>
                </xt-button>
              </div>

          </template>
        </template>
      <template v-if="allCourierVisible">
        <LargeCourierModal v-if="courierShow" :show="allCourierVisible" @close-modal="changeState" />
        <SmallCourierModal v-else :show="allCourierVisible" @close-modal="changeState" />
      </template>
      <teleport to='body'>
        <xt-modal v-if="showCourierDetail" v-model:visible="showCourierDetail" title="" :isFooter="false" zIndex="9"
          :isHeader="false" :boxIndex="10" :maskIndex="9">
          <LargeCourierDetail v-if="largeDetailVisible" @close="showCourierDetail = false" />
          <LogisticsDetail v-else :orderNum="orderNum" @close="closeCourierDetail" @back="backAllCoutiers" />
        </xt-modal>
      </teleport>
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
import { message, Modal, notification } from 'ant-design-vue'
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
import grab from './grab'
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
      largeDetailVisible: true
    };
  },
  methods: {
    ...mapActions(courierStore, [// "getCourierMsg", "getCouriersDetail",
      'getDbCourier', 'refreshCouriers']),
    refreshCourier() {
      // _.debounce(this.refreshCouriers(),1000)
      this.refreshCouriers()
    },
    // changeState() {
    //     this.allCourierVisible = true
    // }
    changeState() {
      this.allCourierVisible = false
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
      // console.log(windoWidth,'windoWidth')
    },
    refreshAll() {
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
    // bindTb(){
    //   if (!this.storeInfo.tb.nickname) {
    //     Modal.confirm({
    //       centered: true,
    //       content: '请在弹出窗内完成淘宝登录，登录后系统会在后台为您获取订单信息。',
    //       onOk: () => {

    //         grab.tb.login((args) => {
    //           this.storeInfo.tb.nickname = args.data.nickname
    //           message.loading({
    //             content: '已成功绑定淘宝账号：' + args.data.nickname + '，正在为您获取订单信息，请稍候…',
    //             key: 'loadingTip',
    //             duration: 0
    //           })
    //           // grab.tb.getOrder((data) => {
    //           //   message.success({ content: '获取订单成功!', key: 'loadingTip', duration: 3 })
    //           //   console.log(data)
    //           //   this.getOrderDetail(data.orders)
    //           // })
    //         })

    //         // tsbApi.web.openPreloadWindow({
    //         //   width: 1200,
    //         //   height: 800,
    //         //   background: false,
    //         //   url: 'https://passport.jd.com/uc/login',
    //         //   preload: window.globalArgs['app-dir_name'] + '/../appPreload/ecommerce/jd/login.js',
    //         //   callback: (data) => {
    //         //     this.loginInfo.jd.nickname=data.nickname
    //         //     message.loading({
    //         //       content: '已成功绑定账号：' + data.nickname + '，正在为您获取订单信息，请稍候…',
    //         //       key: 'loadingTip',
    //         //       duration:0
    //         //     })
    //         //     console.log('登录成功了，接下来进行下一步')
    //         //     //todo 获取到登录成功的信号
    //         //     tsbApi.web.openPreloadWindow({
    //         //       background: true,
    //         //       url: 'https://order.jd.com/center/list.action',
    //         //       preload: window.globalArgs['app-dir_name'] + '/../appPreload/ecommerce/jd/order.js',
    //         //       callback: (data) => {
    //         //
    //         //       }
    //         //     })
    //         //   }
    //         // })

    //       }
    //     })
    //   } else {
    //     message.loading({
    //       content: '已绑定淘宝账号：' + this.storeInfo.tb.nickname + '，正在为您更新订单信息，请稍候…',
    //       key: 'loadingTip',
    //       duration: 0
    //     })
    //     grab.tb.getOrder((args) => {
    //       if(args.status===0){
    //         if(args.code===401){
    //           message.error('获取订单失败，检测到登录信息过期，请重新登录。')
    //           this.storeInfo.tb.nickname=null
    //           this.bindTb()
    //           return
    //         }
    //         message.error('获取订单意外失败。')
    //         return
    //       }
    //       message.success({
    //         content: '更新订单成功!本次共更新：' + args.data.orders.length + '条订单信息',
    //         key: 'loadingTip',
    //         duration: 3
    //       })
    //       // this.getOrderDetail(data.orders)
    //       console.log(args)
    //     })
    //   }
    // },
    bindJd() {
      if (!this.storeInfo.jd.nickname) {
        Modal.confirm({
          centered: true,
          content: '请在弹出窗内完成京东登录，登录后系统会在后台为您获取订单信息。',
          onOk: () => {
            grab.jd.login(({ data }) => {
              this.storeInfo.jd.nickname = data.nickname
              message.loading({
                content: '已成功绑定账号：' + data.nickname + '，正在为您获取订单信息，请稍候…',
                key: 'loadingTip',
                duration: 0
              })
              grab.jd.getOrder(async ({ data }) => {
                message.success({
                  content: '更新订单成功!本次共更新：' + data.orders.length + '条订单信息',
                  key: 'loadingTip',
                  duration: 3
                })
                this.storeInfo.jd.order = data
                await this.getOrderDetail(data.orders)
                console.log(data)
              })
            })
          }
        })
      } else {
        message.loading({
          content: '已绑定账号：' + this.storeInfo.jd.nickname + '，正在为您更新订单信息，请稍候…',
          key: 'loadingTip',
          duration: 0
        })
        grab.jd.getOrder(async ({ data }) => {
          message.success({
            content: '更新订单成功!本次共更新：' + data.orders.length + '条订单信息',
            key: 'loadingTip',
            duration: 3
          })
          this.storeInfo.jd.order = data
          await this.getOrderDetail(data.orders)
          console.log(data)
        })
      }
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
  },
  async mounted() {
    // this.isLoading = true;
    // await this.getCouriersDetail();
    // //console.log(this.couriersDetailMsg);
    // this.deliveryDetails = await this.couriersDetailMsg;

    // //console.log(this.deliveryDetails, 'deliveryDetails');
    //setTimeout(() => {
    //   this.isLoading = false;
    // })
    // await this.refreshCourier()
    // console.log(window.innerWidth)
    this.getDbCourier()
    window.addEventListener("resize", this.handleResize)
  },
  // beforeUpdate() {
  //     // this.changeTag()
  //     if (window.innerWidth > 1200) {
  //         this.toggleDetail = true
  //     } else {
  //         this.toggleDetail = false
  //     }
  // },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },

}
</script>

<style lang="scss" scoped>
.refresh {
  background-color: var(--primary-bg);
  &:hover {
    background-color: var(--secondary-bg);
  }
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

.xt-modal {
  padding: 0px !important;
}
</style>
