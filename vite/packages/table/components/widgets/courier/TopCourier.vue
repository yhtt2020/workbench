<template>
  <div v-if="topCourierVisible" style="position: absolute; top: 40px;z-index: 500;left: 10px;">
    <div class="w-[572px] h-[420px] rounded-xl p-4 " style="background-color: var(--secondary-bg);">
      <div class="flex justify-between h-[32px]">
        <div class="flex mt-2">
          <div class="xt-text">
            <newIcon icon="fluent:box-16-regular" style="font-size: 20px;"></newIcon>
          </div>
          <div class="flex ml-4 xt-text" style="margin-top: -6px;">
            <TopDrop :navList="filterType" v-model:selectType="defaultType"/>
          </div>
        </div>
        <div class="flex">
          <DropIndex :navList="addList" dropStyle="var(--primary-bg) !important" mClass="mr-2"
                     @open="addCourier"></DropIndex>

          <a-tooltip autoAdjustOverflow title="刷新">
            <xt-button :w="32" :h="32" style="border-radius: 8px;background: var(--primary-bg) !important;"
                       @click="refreshCourier">
              <div class="flex items-center justify-center">
                <newIcon icon="fluent:arrow-counterclockwise-20-filled"
                         style="vertical-align: sub;font-size: 1.25rem;"></newIcon>
              </div>

            </xt-button>
          </a-tooltip>
          <a-tooltip autoAdjustOverflow title="设置">
            <xt-button :w="32" :h="32" class="ml-2"
                       style="border-radius: 8px; background: var(--primary-bg) !important;"
                       @click="openCourierSetting">
              <div class="flex items-center justify-center">
                <newIcon icon="fluent:settings-16-regular" style="vertical-align: sub;font-size: 1.25rem;">
                </newIcon>
              </div>
            </xt-button>
          </a-tooltip>
          <a-tooltip autoAdjustOverflow title="关闭">
            <xt-button :w="32" :h="32" class="ml-2"
                       style="border-radius: 8px; background: var(--primary-bg) !important;"
                       @click="showTopCourier">
              <div class="flex items-center justify-center">
                <newIcon icon="fluent:dismiss-16-filled" style="vertical-align: sub;font-size: 1.25rem;">
                </newIcon>
              </div>

            </xt-button>
          </a-tooltip>
        </div>
      </div>

      <div v-if="isLoading">
        <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%"/>
      </div>

      <template v-else>
        <vue-custom-scrollbar class="mt-2" ref="threadListRef" :key="currentPage" :settings="outerSettings"
                              style="height: calc(100% - 35px) ;overflow: hidden;flex-shrink: 0;width: 100%;">
          <ListItem v-for="(item, index) in displayList" :key="index" :item="item"
                    @goDetail="viewDeliveryDetails(item)"/>
        </vue-custom-scrollbar>
      </template>

    </div>
  </div>
  <xt-button :w="60" :h="27" v-if="this.settings.courierStatus.statusBar   "
             style="background-color: var(--active-secondary-bg);margin-left: 12px;position: relative;color: var(--primary-text);"
             @click="showTopCourier">
    <div class="flex items-center justify-between">
      <newIcon icon="fluent-emoji:package" style="font-size: 20px;margin-right: 4px;vertical-align: sub"/>
      <span v-if="list.length>0"
        style="display: inline-block; width: 20px; height: 20px;background-color: var(--active-bg);border-radius: 50%;text-align: center;line-height: 20px;font-size: 14px;color: rgba(255,255,255,0.85);">{{
          list.length
        }}</span>
    </div>
  </xt-button>
  <teleport to='body'>
    <AddCourierModal ref="addCourierRef"/>
  </teleport>
  <teleport to='body'>
    <xt-modal v-if="showCourierDetail" v-model:visible="showCourierDetail" title="" :isFooter="false" zIndex="9"
              :isHeader="false" :boxIndex="100" :maskIndex="99">
      <LargeCourierDetail v-if="largeDetailVisible" @close="showCourierDetail = false"/>
      <LogisticsDetail v-else :orderNum="orderNum" @close="closeCourierDetail" @back="backAllCoutiers"/>
    </xt-modal>
  </teleport>
  <SmallCourierModal :show="showSmallDetail" @close-modal="smallDetailsVisible"/>
  <teleport to='body'>
    <CourierSetting ref="courierSettingRef"/>
  </teleport>
</template>
<script>
import Widget from '../../card/Widget.vue'
import { Icon as newIcon } from '@iconify/vue'
import MinCourierItem from './MinCourierItem.vue'
import Empty from './Empty.vue'
import MinEmpty from './MinEmpty.vue'
import { courierStore } from '../../../apps/ecommerce/courier.ts'
import { mapWritableState, mapActions } from 'pinia'
import TopDrop from './courierModal/dropdown/index.vue'
import AddCourierModal from './courierModal/AddCourierModal.vue'
import LogisticsDetail from './courierModal/content/LogisticsDetail.vue'
import CourierSetting from './courierModal/CourierSetting.vue'
import LargeCourierDetail from './courierModal/content/LargeCourierDetail.vue'
import SmallCourierModal from './courierModal/SmallCourierModal.vue'
import DropIndex from './courierModal/dropdown/DropIndex.vue'
import ui from './courierUI'
import ListItem from './ListItem.vue'
import { getOrderState, preHandle } from './courierTool'

export default {
  name: '我的快递',
  components: {
    Widget,
    newIcon,
    MinCourierItem,
    Empty,
    MinEmpty,
    ListItem,
    AddCourierModal,
    LogisticsDetail,
    CourierSetting,
    TopDrop,
    LargeCourierDetail,
    SmallCourierModal,
    DropIndex
  },
  data () {
    return {
      list: [],
      settingVisible: false,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      topCourierVisible: false,
      couriersList: [],
      isLoading: false,
      showCourierDetail: false,
      typeList: [
        {
          title: '全部',
          name: '全部',
          type: 'all'
        },
        {
          title: '淘宝',
          name: '淘宝',
          type: 'tb'
        },
        {
          title: '京东',
          name: '京东',
          type: 'jd'
        },
        {
          title: '普快',
          name: '普快',
          type: 'common'
        }

      ],
      largeDetailVisible: true,
      showSmallDetail: false,
      addList: [
        {
          title: '京东账号', name: 'jd',
          callBack: () => { }
        },
        {
          title: '淘宝账号', name: 'tb',
          callBack: () => { }
        },
        {
          title: '自定义',
          icon: 'fluent:add-16-filled',
          callBack: () => {
            this.addCourier()
          }
        },
      ],
      defaultType: {},
    }
  },
  methods: {
    ...mapActions(courierStore, [
      // 'getCourierMsg',
      'getDbCourier', 'refreshCouriers'
    ]),
    async showTopCourier () {
      this.topCourierVisible = !this.topCourierVisible
      // if (this.topCourierVisible == true) {
      //     this.couriersList = await this.couriersDetailMsg
      // }
    },
    addCourier () {
      this.topCourierVisible = false
      this.$refs.addCourierRef.openCourierModel()
    },
    // async refreshExpress() {
    //     this.isLoading=true
    //     this.couriersList = await this.couriersDetailMsg
    //     setTimeout(() => {
    //         this.isLoading=false
    //     });

    // }
    viewDeliveryDetails (item) {
      this.currentDetail = item
      this.topCourierVisible = false
      this.showCourierDetail = true
      // console.log(this.currentDetail)
    },
    closeCourierDetail () {
      this.showCourierDetail = false
    },
    refreshCourier () {
      ui.refreshAll()
    },

    //打开设置
    openCourierSetting () {
      this.$refs.courierSettingRef.openSettingModal()
    },
    backAllCoutiers () {
      this.showSmallDetail = true,
        this.showCourierDetail = false
    },
    smallDetailsVisible () {
      this.showSmallDetail = false
    },
    handleResize () {
      let windoWidth = window.innerWidth
      // console.log(windoWidth);
      if (windoWidth > 1200) {
        this.largeDetailVisible = true
        // this.courierShow = true;
      } else {
        this.largeDetailVisible = false
        // this.courierShow = false;
      }
      // console.log(windoWidth,'windoWidth')
    },
    reload (list) {
      this.list = preHandle(list)
      if (this.settings.courierStatus.currentStatus === 'followed') {
        this.list = this.list.filter(li => {
          return li.followed
        })
      } else {
        this.list = this.list.filter(li => {
          return getOrderState(li) !== 'signed' && getOrderState(li) !== 'canceled'
        })
      }
    }
  },
  computed: {
    ...mapWritableState(courierStore, ['orderList', 'couriersDetailMsg', 'storeInfo', 'settings', 'currentDetail']),
    config () {
      return {
        jdOrder: this.storeInfo.jd.order && this.storeInfo.jd.order.orders !== undefined,
        tbOrder: this.storeInfo.tb.order && this.storeInfo.tb.order.orders !== undefined,
        otherOrder: this.orderList && this.orderList !== undefined,
        allLength: this.orderList?.length !== undefined ? this.orderList?.length : 0,
        jdLength: this.storeInfo?.jd?.order?.orders?.length !== undefined ? this.storeInfo?.jd?.order?.orders?.length : 0,
        tbLength: this.storeInfo?.tb?.order?.orders?.length !== undefined ? this.storeInfo?.tb?.order?.orders?.length : 0,
      }
    },
    filterType () {
      const list = [...this.typeList]
      const filterList = list.map((item) => {
        let count = 0
        let returnItem = {
          title: item.title,
          name: item.name,
          type: item.type
        }
        if (item.name === 'all') {
          count = this.orderList.length
        } else {
          count = ui.filterOrder('all', item.type, this.list).length
        }
        returnItem.title = returnItem.title + (count > 0 ? '（' + count + '）' : '')
        return returnItem
      })
      return filterList
    },
    currentType () {
      return this.defaultType
    },
    displayList () {
      let list = this.list
      list = list.filter(li => {
        if (this.defaultType.type === 'all') {
          return true
        } else if (this.defaultType.type === 'common') {
          return !li.store
        } else {
          return li.store === this.defaultType.type
        }
      })

      return list

    }

  },
  mounted () {
    this.getDbCourier()
    window.addEventListener('resize', this.handleResize)
    this.defaultType = this.filterType[0]
    setTimeout(() => {
      this.defaultType = this.currentType
    }, 2000)

  },
  beforeDestroy () {
    window.addEventListener('resize', this.handleResize)
  },
  watch: {
    currentType () {
      this.defaultType = this.currentType
    },
    'orderList': {
      handler (newVal) {
        this.reload(newVal)
      }
    },
    'settings.courierStatus.currentStatus': {
      handler (newVal) {
        this.reload(this.orderList)
      }
    }

  }
}
</script>
<style lang="scss">
.courier {
  .add-courier {
    display: none;

  }

  &:hover {
    .add-courier {
      display: block;
    }
  }
}</style>
