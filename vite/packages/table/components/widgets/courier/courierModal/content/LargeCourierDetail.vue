<template>
  <div :class="{'small':mode==='small'}" class="flex flex-col" style="" :style="mode==='small'?'width:580px;height:700px':'width: 976px;height: 600px;'">
    <div class="flex items-center justify-center w-full pb-4 mb-4" style="position: relative;">
<!--      {{mode}} {{route}}-->
      <div class="flex" v-if="mode==='large'">
        <HorizontalPanel :navList="tabs.slice(0,4)" v-model:selectType="defaultFlow"/>
        <DropDown class="ml-3" :navList="tabs.slice(4)" @selectType="getSelectType"></DropDown>
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
      <div class="flex w-full justify-between px-6 flex-1 h-0" >
        <div :class="{'w-1/2':mode==='large','w-full':mode==='small'}" class="flex flex-col h-full " v-if="route==='list' || mode==='large'">
          <div class="flex items-center mb-4 justify-between">
            <SelectPlateform @changePlatform="changePlatform"/>
            <div class="flex" v-if="findVisible">
              <div  class="mr-2">
                <a-input size="large" v-model:value="searchWords" allow-clear class="rounded-full"></a-input>
              </div>
              <xt-button  @click="findVisible=false;searchWords=''" w="40" h="40"> <CloseOutlined  style="font-size: 1.1em"/> </xt-button>
            </div>
            <div class="flex " v-else>
              <xt-button  w="40" h="40" class="category-button mr-2" @click="showFind">
                <div class="flex items-center justify-center">
                  <SearchOutlined  style="font-size: 1.2em"/>
                </div>
              </xt-button>
              <a-tooltip placement="top" class="mr-3" :title="lastRefreshTime">
                <xt-button w="40" h="40" class="category-button" @click="refreshAll">
                  <div class="flex items-center justify-center">
                    <SmallIcon icon="fluent:arrow-counterclockwise-20-filled"  style="font-size: 1.2em" />
                  </div>
                </xt-button>
              </a-tooltip>
            </div>
          </div>
          <!--          <template v-if="allShow">-->
          <!--            &lt;!&ndash;    全部展示        &ndash;&gt;-->
          <!--            <SortList :list="list" @rightSelect="getRightItem"/>-->
          <!--          </template>-->
          <!--      其他条件      -->
          <template v-if="displayList?.length === 0">
            <Empty :exampleVisible="false"/>
          </template>
          <div  class="flex flex-col mr-4 h-0 flex-1 w-full">
            <vue-custom-scrollbar :settings="settingsScroller" class="h-full">
              <ListItem @showItem="showItem(item)" :ref="el=>setItemRef(el,item)"
                        @afterRemove="(item)=>{this.afterRemove(item,index)}"
                        @scrollToCurrent="scrollToItem(currentDetail._id)" :item="item"
                        @goDetail="goDetail(item)" v-for="(item,index) in displayList"></ListItem>
            </vue-custom-scrollbar>
          </div>
        </div>
        <div style="" :style="{width:mode==='small'?'100%':'452px'}" class="h-full" v-if="route==='detail' || mode==='large'">
          <div class="left-back" v-if="mode==='small'">
            <a-tooltip placement="top">
              <template #title>
                <span class="xt-text-2">返回</span>
              </template>
              <xt-button type="default" w="32" h="32"  @click="goBack" style="border-radius: 8px !important;">
                <div class="flex items-center justify-center " >
                  <SmallIcon icon="fluent:chevron-left-16-filled" class="xt-text-2" style="font-size:1.2rem;"/>
                </div>
              </xt-button>
            </a-tooltip>
          </div>
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
import { kdCompany, kdState, switchColor } from '../../lib/mock'
import { Modal } from 'ant-design-vue'

import HorizontalPanel from '../../../../HorizontalPanel.vue'
import AddCourierModal from '../AddCourierModal.vue'
import CourierSetting from '../CourierSetting.vue'
import DropIndex from '../dropdown/DropIndex.vue'
import DropDown from '../dropdown/MoreDrop.vue'
import Empty from '../../Empty.vue'
import RightDetail from './RightDetail.vue'
import SelectPlateform from '../dropdown/SelectPlateform.vue'
import Cover from '../../component/Cover.vue'
import { preHandle } from '../../lib/courierTool'
import ui from '../../lib/courierUI'
import ListItem from '../../ListItem.vue'
import { formatTime } from '../../../../../util'
import {CloseOutlined,SearchOutlined} from '@ant-design/icons-vue'
export default {
  components: {
    ListItem,
    Cover,
    SmallIcon, HorizontalPanel, DropIndex, AddCourierModal,
    CourierSetting, DropDown, Empty, RightDetail, SelectPlateform,
    CloseOutlined,SearchOutlined
  },
  emits:['changeRoute'],
  props:{
    mode:{
      type:String,
      default:'large'
    },
    route:{
      type:String,
      default:'list'
    }
  },
  data () {
    return {
      itemRefs: [],
      addList: [
        { title: '京东账号', name: 'jd', callBack: () => {} },
        { title: '淘宝账号', name: 'tb', callBack: () => {} },
        { title: '自定义添加', icon: 'fluent:add-16-filled', callBack: () => { this.addCourier() } }
      ],
      tabs: [],//用于显示的tab
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
      findVisible:false,//查找可见度
      searchWords:'',//查找关键词
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
    ...mapWritableState(courierStore, ['orderList', 'currentDetail', 'settings']),
    lastRefreshTime () {
      return this.settings.lastRefreshTime ? '最后刷新时间：' + formatTime(this.settings.lastRefreshTime) : ''
    },
    displayList () {
      let list = this.detailList.filter(item => {
        if (this.filterPlatform === 'all') {
          return true
        } else {
          if (!item.store) {
            item.store = ''
          }
          return item.store === this.filterPlatform
        }
      })
      if(this.searchWords){
        list=list.filter(li=>{
          return li.title?.includes(this.searchWords)
        })
      }
      return selectData(this.defaultFlow, list)
    },

    allShow () {
      return this.defaultFlow?.name === 'all'
    }
  },

  methods: {
    formatTime,
    ...mapActions(courierStore, ['removeDbData', 'getHideList']),
    showFind(){
      this.findVisible=true
    },
    goDetail(item){
      this.currentDetail=item
      if(this.mode==='small'){
        this.$emit('changeRoute','detail')
      }
    },
    goBack(){
      console.log('提交时间')
      this.$emit('changeRoute','list')
    },
    refreshAll: ui.refreshAll,
    async showItem (item) {
      console.log('需要显示', item)
      this.detailList.splice(this.detailList.findIndex(i => {
        return i._id === item._id
      }), 1)

      await this.getTabList()
    },
    afterRemove(item,index){
      if(item!==this.currentDetail){
        return
      }
      if(index>=1){
        this.currentDetail=this.displayList[index-1]
      }else if(this.displayList.length===0){
        this.currentDetail=null
        return
      }else if(this.displayList.length===1){
        this.currentDetail=this.displayList[0]
      }
      this.$nextTick(()=>{
        this.scrollToItem(this.currentDetail._id)
      })
    },
    scrollToItem (id) {
      setTimeout(() => {
        let found = this.itemRefs.find(item => {
          return item.id === id
        })
        if (found) {
          found.el.$el.scrollIntoView()
          setTimeout(() => {
            found.el.$el.firstElementChild.style.border = 'solid var(--active-bg) 2px'
            setTimeout(() => {
              found.el.$el.firstElementChild.style.border = ''
            }, 400)
          }, 400)

        }
      }, 500)
    },
    setItemRef (el, item) {
      this.itemRefs.push({
        el: el,
        id: item._id
      })
    },
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
    // 计算获取tab栏数据
    async getTabList () {
      if (this.orderList.length > 0) {
        console.log('重新获取数量')
        //至少有一个数据
        const list = []
        for (const type of courierType) {
          list.push(await selectTab(type, this.orderList))
        }
        this.tabs = list
      }
    },
    // 自定义添加快递
    addCourier () {
      this.$refs.addCourierRef.openCourierModel()
    },

    getRightItem (item) {
      this.currentDetail = item
      console.log(this.currentDetail, 'de')
    },

    refresh () {
      // todo 刷新
    }
  },

  async mounted () {

    this.filterPlatform = 'all'
    this.detailList = preHandle(this.orderList)
    console.log('与阿婆', this.detailList)
    this.scrollToItem(this.currentDetail._id)
    await this.getTabList()
    //this.defaultFlow = (await this.getTabList())[0]
    // console.log(this.list, 'display',this.$refs)
    // setTimeout(()=>{
    //   console.log('全部',this.itemRefs)
    //   let needToScroll=this.itemRefs.find(item=>{
    //     return item.id===this.currentDetail._id
    //   })
    //
    // },1000)
  },

  watch: {
    'defaultFlow': {
      async handler (newVal) {
        console.log('自', newVal)
        if (newVal?.name === 'hide') {
          let list = await this.getHideList()
          console.log('list=筛选 ', list)
          this.detailList = preHandle(list)
        } else {
          this.detailList = preHandle(this.orderList)
        }
      },
      immediate: true
    },
    'orderList': {
      handler (newVal) {
        if (this.defaultFlow.name === 'hide') {
          return
        }
        this.detailList = preHandle(newVal)
        this.getTabList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.right-button {
  position: absolute;
  top: 0px;
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

.left-back{
  position: absolute;
  top: 0;
  left: 16px;
}
.small{
  .right-button{
    top:0px;
    right:0px
  }
}

:deep(.main-model){
  margin: 0 !important;
}
</style>
