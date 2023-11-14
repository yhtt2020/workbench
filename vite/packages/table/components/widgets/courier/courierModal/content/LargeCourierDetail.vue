<template>
  <div class="flex flex-col" style="width: 976px;height: 600px;">
    <div class="flex items-center justify-center w-full py-4 mb-4" style="position: relative;">
      <div class="flex">
        <HorizontalPanel :navList="tabList.slice(0,4)" v-model:selectType="defaultFlow"/>
        <DropDown class="ml-3" :navList="tabList.slice(4)" @selectType="getSelectType"></DropDown>
      </div>
      <div class="flex right-button">
        <DropIndex :navList="addList" dropStyle="var(--secondary-bg) !important" @open="addCourier"></DropIndex>
        <a-tooltip placement="top" class="mr-3" title="设置">
          <xt-button w="32" h="32" class="xt-bg" @click="openSetting" style="border-radius: 8px !important;">
            <div class="flex items-center justify-center">
              <SmallIcon icon="fluent:settings-16-regular" class="xt-text-2" style="font-size: 1.25rem;"/>
            </div>
          </xt-button>
        </a-tooltip>
        <a-tooltip placement="top" title="关闭">
          <xt-button w="32" h="32" class="xt-bg" @click="close" style="border-radius: 8px !important;">
            <div class="flex items-center justify-center">
              <SmallIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;"/>
            </div>
          </xt-button>
        </a-tooltip>
      </div>
    </div>

    <!-- 如果没有快递单号   -->
    <Empty v-if="orderList.length === 0" :exampleVisible="false"/>

    <template v-else>
      <!--   筛选不到数据   -->
      <template v-if="orderList?.length === 0">
        <Empty :exampleVisible="false"/>
      </template>
      <div v-else class="flex w-full justify-between px-6 flex-1 h-0">
        <div   class="flex flex-col h-full w-1/2">
          <div class="flex items-center mb-4 justify-between">
            <SelectPlateform @changePlatform="changePlatform"/>
            <xt-button w="40" h="40" class="category-button" @click="refreshAll">
              <div class="flex items-center justify-center">
                <SmallIcon icon="fluent:arrow-counterclockwise-20-filled" style="1.25rem"/>
              </div>
            </xt-button>
          </div>
          <template v-if="allShow">
            <!--    全部展示        -->
            <SortList :list="displayList" @rightSelect="getRightItem"/>
          </template>
          <template v-else>
            <!--      其他条件      -->
            <div style="height: 460px;" class="flex flex-col mr-4 h-full w-full">
              <vue-custom-scrollbar :settings="settingsScroller" style="height:500px;">
                <div v-for="(item,index) in displayList"
                     class="flex p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item"
                     :class="{ 'select': currentID === index }"
                >
                  <xt-menu name="name" @contextmenu="revID = index" :menus="menus">
                    <div class="flex flex-col justify-between" @click.prevent="detailClick(item,index)">
                      <div class="flex">
                        <div class="flex items-center justify-center mr-4 rounded-lg">
                          <Cover :cover="item.cover" :store="item.store" bg="var(--mask-bg)"></Cover>
                        </div>
                        <div class="flex items-center justify-between " style="width:362px;">
                          <div class="flex flex-col">
                            <div class="flex items-center mb-1.5">
                              <div v-if="item.store==='jd'"
                                   class="w-6 h-6 store flex items-center justify-center rounded-md"
                                   style="background:#E12419;"> JD
                              </div>
                              <div v-if="item.store==='tb'"
                                   class="w-6 h-6 store flex items-center justify-center rounded-md"
                                   style="background:#FA5000;"> 淘
                              </div>
                              <span class="xt-font font-14 font-600 mx-1.5">
                        {{ item.title?.slice(0, 20) }}
                      </span>
                              <span class="fav-icon">
                      <SmallIcon v-if="!item.followed" icon="fluent:star-12-regular"/>
                      <SmallIcon icon="fluent:star-16-filled" v-else style="color:var(--warning);"/></span>
                            </div>
                            <div class="flex">
                              <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg " style="width:68px;">
                                {{ item.company }}
                              </div>
                              <div v-if="false"
                                   class="flex items-center justify-center rounded-md w-6 h-6 xt-text-2 xt-bg">拆
                              </div>
                            </div>
                          </div>
                          <div class="flex flex-col items-center justify-end">
                            <div class="flex items-center ml-8 mb-2 pl-1 pr-1 rounded-md state-text"
                                 :style="{ 'background': item.tagColor,color:'var(--active-text)'}">
                              {{ item.stateText }}
                            </div>
                            <span v-if="false" class="xt-text-2 font-14 font-400">预计明天到达</span>
                          </div>
                        </div>
                      </div>

                      <div class="flex flex-col">
                        <div class="my-1.5 font-14 font-400 xt-text-2">{{ item.lastNodeTime }}</div>
                        <div class="summary">
                          {{ item.lastNodeSummary }}
                        </div>
                      </div>
                    </div>
                  </xt-menu>
                </div>
              </vue-custom-scrollbar>
            </div>
          </template>
        </div>

        <div style="width:452px;" class="h-full">
          <RightDetail v-if="currentDetail?._id" :detail="currentDetail"/>
        </div>
      </div>
    </template>
  </div>

  <AddCourierModal ref="addCourierRef"/>

  <CourierSetting ref="courierSettingRef"/>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { courierStore } from '../../../../../apps/ecommerce/courier'
import { Icon as SmallIcon } from '@iconify/vue'
import { courierType, selectTab, selectData } from '../modalMock'
import { kdCompany, kdState, switchColor } from '../../mock'
import { Modal } from 'ant-design-vue'

import HorizontalPanel from '../../../../HorizontalPanel.vue'
import AddCourierModal from '../AddCourierModal.vue'
import CourierSetting from '../CourierSetting.vue'
import DropIndex from '../dropdown/DropIndex.vue'
import DropDown from '../dropdown/MoreDrop.vue'
import SortList from '../dropdown/SortList.vue'
import Empty from '../../Empty.vue'
import RightDetail from './RightDetail.vue'
import SelectPlateform from '../dropdown/SelectPlateform.vue'
import Cover from '../../component/Cover.vue'
import { preHandle } from '../../courierTool'
import ui from '../../courierUI'
export default {
  components: {
    Cover,
    SmallIcon, HorizontalPanel, DropIndex, AddCourierModal,
    CourierSetting, DropDown, SortList, Empty, RightDetail, SelectPlateform
  },

  data () {
    return {
      addList: [
        { title: '京东账号', name: 'jd', callBack: () => {} },
        { title: '淘宝账号', name: 'tb', callBack: () => {} },
        { title: '自定义添加', icon: 'fluent:add-16-filled', callBack: () => { this.addCourier() } }
      ],
      filterPlatform: 'all',
      menus: [
        { name: '关注物流', callBack: () => { }, newIcon: 'fluent:star-12-regular' },
        {
          name: '删除快递', newIcon: 'akar-icons:trash-can', color: 'var(--error)',
          callBack: () => {
            Modal.confirm({
              content: '确认删除当前快递物流信息',
              centered: true,
              onOk: () => {
                this.removeDbData(this.revID)
                message.success('删除成功')
              }
            })
          },
        }
      ],
      defaultFlow: {
        name: 'all'
      },
      detailList: [],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      revID: '',
      currentID: '',
      rightDetail: {},
    }
  },

  computed: {
    ...mapWritableState(courierStore, ['orderList', 'currentDetail']),
    displayList () {
      let list = this.detailList.filter(item => {
        if (this.filterPlatform === 'all') {
          return true
        } else {
          console.log(String(item.store), this.filterPlatform, item.store === this.filterPlatform)
          if (!item.store) {
            item.store = ''
          }
          return item.store === this.filterPlatform
        }
      })
      return selectData(this.defaultFlow, list)
    },
    // 计算获取tab栏数据
    tabList () {
      if (this.orderList.length > 0) {
        //至少有一个数据
        const list = courierType.map((item) => {
          /*计算每个分类包含的数量*/
          return selectTab(item, this.orderList)
        })
        return list
      } else {
        return courierType
      }
    },
    allShow () {
      return this.defaultFlow?.name === 'all'
    }
  },

  methods: {
    ...mapActions(courierStore, ['removeDbData']),
    refreshAll:ui.refreshAll,
    // 关闭
    close () { this.$emit('close') },
    // 打开快递设置
    openSetting () { this.$refs.courierSettingRef.openSettingModal() },
    // 获取下拉菜单点击后的数据
    getSelectType (item) {
      this.defaultFlow = item
      this.detailList = selectData(item, this.detailList)
    },

    stateColor (item) {
      return switchColor(item.State)
    },
    switchState (item) {
      return kdState(item.State)
    },
    switchCompany (item) {
      return kdCompany(item?.ShipperCode)
    },
    changePlatform (platform) {
      console.log('修改平台', platform)
      this.filterPlatform = platform
    },
    // 列表点击显示详情
    detailClick (item, index) {
      this.currentID = index
      this.currentDetail = item
    },

    // 自定义添加快递
    addCourier () {
      this.$refs.addCourierRef.openCourierModel()
    },

    getRightItem (item) {
      this.currentDetail = item
      console.log(this.rightDetail, 'de')
    },

    refresh () {
      // todo 刷新
    }
  },

  mounted () {
    this.defaultFlow = this.tabList[0]
    this.filterPlatform = 'all'
    this.detailList=preHandle(this.orderList)
    console.log(this.displayList, 'display')
    // setTimeout(()=>{
    //   this.changePlatform('all')
    // },1000)
  },

  watch: {
    'defaultFlow': {
      handler (newVal) {
        this.detailList = selectData(newVal, preHandle(this.orderList))
      },
      immediate: true
    },
    'orderList':{
      handler(newVal){
        this.detailList=preHandle(newVal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.right-button {
  position: absolute;
  top: 16px;
  right: 16px;
}

:deep(.nav-item) {
  width: 96px;
  height: 24px !important;
  border-radius: 8px !important;
}

:deep(.state-bg) {
  height: 32px !important;
}

.summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;
  font-size: 14px;
  color: var(--primary-text);
  font-weight: 400;
}

.select {
  background: var(--active-secondary-bg) !important;
}

:deep(.empty-content) {
  height: 400px !important;
  margin: 50px 0 !important;
  justify-content: center !important;
}
.state-text {
  width: auto;
  text-wrap: nowrap;
}

.store {
  min-width: 25px;
}

.fav-icon {
  font-size: 18px;
  display: inline-block;
  min-width: 18px;
}
</style>
