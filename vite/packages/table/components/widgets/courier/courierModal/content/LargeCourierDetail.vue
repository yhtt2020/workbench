<template>
  <div class="flex flex-col" style="width: 976px;height: 600px;">
    <div class="flex items-center justify-center w-full py-4" style="position: relative;">
      <HorizontalPanel :navList="flowType" v-model:selectType="defaultFlow" />

      <div class="flex right-button">
        
        <DropIndex :navList="addList"></DropIndex>

        <a-tooltip placement="top" class="mr-3">
          <template #title>
            <span class="xt-text-2">设置</span>
          </template>
          <xt-button w="32" h="32"  @click="openSetting" style="border-radius: 8px !important;">
            <div class="flex items-center justify-center">
              <SmallIcon icon="fluent:settings-16-regular" class="xt-text-2" style="font-size: 1.25rem;" />
            </div>
          </xt-button>
        </a-tooltip>
        
        <a-tooltip placement="top">
          <template #title>
            <span class="xt-text-2">关闭</span>
          </template>
          <xt-button w="32" h="32"  @click="close" style="border-radius: 8px !important;">
            <div class="flex items-center justify-center">
              <SmallIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;" />
            </div>
          </xt-button>
        </a-tooltip>
      </div>
    </div>

    <template v-if="this.couriersList?.length === 0">
      <div class="flex flex-col items-center justify-center h-full px-6">
        <SmallIcon icon="fluent-emoji:package" style="font-size: 3.5rem;" />
        <div class="px-4 py-3 my-4 rounded-lg xt-bg-2 xt-text">
          在桌面上时刻关注你的快递动态，支持批量添加快递单号，自定义修改快递名称和图标。
        </div>
        <xt-button w="95" type="theme" h="40" @click="addCourier">添加快递</xt-button>
      </div>
    </template>

    <template v-else>
      <div class="flex justify-between px-6">
        <template v-if="allVisible">
          <SortList  :list="filterList" @rightSelect="getRightItem" />
          <div style="width: 452px;">
            <UpdateIcon :orderData="rightList" />
            <div class="px-4 rounded-lg xt-bg-2">
              <vue-custom-scrollbar :settings="settingsScroller" style="height:426px;">
                <TimeLine :list="rightList?.Traces" />
              </vue-custom-scrollbar>
            </div>
          </div> 
        </template>

        <template v-else>
          <div style="width: 452px;" class="flex flex-col">
            <vue-custom-scrollbar :settings="settingsScroller" style="height:500px;">
              <div v-for="(item,index) in otherList" :class="{ 'select': currentID === item.LogisticCode }"
                class="flex p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item" @click="seeDetail(item)">
                <xt-menu name="name" @contextmenu="revID = index" :menus="menus">
                  <div class="flex w-full">
                    <div class="flex items-center justify-center mr-4 rounded-lg w-14 h-14" style="background: var(--mask-bg);">
                      <SmallIcon icon="fluent-emoji:package" style="font-size: 2rem;" />
                    </div>
                    <div class="flex flex-col items-center">
                      <div class="flex items-center justify-between " style="width: 355px;">
                        <span class="xt-font font-16 font-600">
                          {{ item.LogisticCode }}
                        </span>
      
                        <div class="flex">
                          <div class="flex xt-text-2" style="font-size: 14px;text-align: center;">
                            <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2">
                              {{ switchCompany[index] }}
                            </div>
                            <div class="flex items-center pl-1 pr-1 rounded-md" :style="{ 'background': stateColor[index] }">
                              {{ switchState[index] }}
                            </div>
                          </div>
                        </div>
                      </div>
      
                      <div class="my-1.5 font-14 font-400 xt-text-2">{{ item.Traces[item.Traces.length - 1]?.AcceptTime }}</div>
                      <div class="summary">
                        {{ item.Traces[item.Traces.length - 1]?.AcceptStation }}
                      </div>
                    </div>
                  </div>
                </xt-menu>
              </div>
              <div style="height: 12px;"></div>
            </vue-custom-scrollbar>
          </div>
          <div style="width: 452px;" v-if="otherList.length !== 0">
            <UpdateIcon :orderData="rightList" />
            <div class="px-4 rounded-lg xt-bg-2">
              <vue-custom-scrollbar :settings="settingsScroller" style="height:426px;">
                <TimeLine :list="rightList?.Traces" />
              </vue-custom-scrollbar>
            </div>
          </div>
        </template>
      </div>
    
    </template>

  </div>

  <AddCourierModal ref="addCourierRef" />

  <CourierSetting ref="courierSettingRef" />
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { courierModalStore } from '../courierModalStore'
import { Icon as SmallIcon } from '@iconify/vue'
import { courierDetailList, courierType } from '../modalMock'
import { courierStore } from '../../../../../store/courier'
import HorizontalPanel from '../../../../HorizontalPanel.vue'
import TimeLine from '../timeLine/index.vue'
import AddCourierModal from '../AddCourierModal.vue'
import UpdateIcon from '../updateIcon/index.vue'
import SortList from '../dropdown/SortList.vue'
import { kdCompany, kdState, switchColor } from '../../mock'

import CourierSetting from '../CourierSetting.vue'
import DropIndex from '../dropdown/DropIndex.vue'

export default {
  props: [''],

  components: {
    SmallIcon, HorizontalPanel, TimeLine, AddCourierModal, UpdateIcon, SortList,
    CourierSetting,DropIndex,
  },

  data() {
    return {
      couriersList: [],
      largeList: courierDetailList,

      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },

      defaultFlow: { title: `全部${courierDetailList.length !== 0 ? `(${courierDetailList.length})` : ''} `, name: 'all' },

      currentID: '',

      // rightList:this.couriersList[0], 接收选中的详情
      rightList: {},

      menus:[
      {
       name:'查看详情',
       callBack:()=>{},
       newIcon:'fluent:apps-list-detail-24-regular'
      },
      {
        name:'订阅物流',
        callBack:()=>{

        },
        newIcon:'fluent:star-12-regular'
      },
      {
       name:'删除快递',
       callBack:()=>{
         this.removeSortData(this.revID)
         this.removeDbData(this.revID)
       },
       newIcon:'akar-icons:trash-can',
       color:'var(--error)'
      },
      ],

      addList:[
        {
          title:'京东账号',name:'jd',
          callBack:()=>{}
        },
        {
          title:'淘宝账号',name:'tb',
          callBack:()=>{}
        },
        { 
          title:'自定义',
          icon:'fluent:add-16-filled',
          callBack:()=>{
            this.addCourier()
          }
        },
      ]
    }
  },

  computed: {
    ...mapWritableState(courierModalStore, ['sortList']),
    ...mapWritableState(courierStore, ['couriersDetailMsg','courierDetailList','viewCourierDetail']),
    flowType() {
      const allLength = this.couriersList.length;
      //  揽收
      const received = this.couriersList.filter((item) => { return item.State === '1' })
      //  签收
      const hasSigned = this.couriersList.filter((item) => { return item.State === '3' })
      //  在途中--包括在途中，问题件，转寄，清关的快递件
      const onWay = this.couriersList.filter((item) => { return item.State !== '1' && item.StateEx !== '202' && item.State !== '3' })
      //  派件中
      const outDelivery = this.couriersList.filter((item) => { return item.StateEx === '202' })
      

      const list = [...courierType]
      const filterList = list.map((item) => {
        switch (item.name) {
          case 'all':
            return { title: `${item.title}${allLength.length !== 0 ? `(${allLength})` : ''}`, name: item.name, type: item.type }
          case 'collect':
            return { title: `${item.title}${received.length !== 0 ? `(${received.length})` : ''}`, name: item.name, type: item.type }
          case 'enRoute':
            return { title: `${item.title}${onWay.length !== 0 ? `(${onWay.length})` : ''}`, name: item.name, type: item.type }
          case 'delivery':
            return { title: `${item.title}${outDelivery.length !== 0 ? `(${outDelivery.length})` : ''}`, name: item.name, type: item.type }
          case 'signed':
            return { title: `${item.title}${hasSigned.length !== 0 ? `(${hasSigned.length})` : ''}`, name: item.name, type: item.type }
        }
      })
      return filterList

    },

    filterList() {
      console.log('查看数据',this.couriersList);
      // return this.couriersList
      if (this.allVisible) {
        if (this.sortList.length !== 0) {
          return this.sortList
        } else {
          return this.couriersList
        } 
      }
    },

    otherList() {
      switch (this.defaultFlow.name) {
        case 'collect':
          const colList = this.couriersList.filter((item) => { return item.State === '1' });
          return colList;
        case 'delivery':
          const deliList = this.couriersList.filter((item) => { return item.StateEx === '202' });
          return deliList;
        case 'enRoute':
          const wayList = this.couriersList.filter((item) => { return item.State !== '1' && item.StateEx !== '202' && item.State !== '3' });
          return wayList;
        case 'signed':
          const signList = this.couriersList.filter((item) => { return item.State === '3' });
          return signList;
      }
    },

    allVisible() {
      return this.defaultFlow.name === 'all'
    },
    stateColor() {
      let colorList = this.otherList.map((item) => {
        return switchColor(item.State)
      })
      return colorList
    },
    switchState() {
      let stateList = this.otherList.map((item) => {
        return kdState(item.State)
      })
      return stateList
    },
    switchCompany() {
      let companyList = this.otherList.map((item) => {
        return kdCompany(item.ShipperCode)
      })
      return companyList
    },

  },

  methods: {
    ...mapActions(courierStore,['getDbCourier','removeDbData']),
    ...mapActions(courierModalStore,['removeSortData']),
    // 添加快递入口
    addCourier() {
      this.$refs.addCourierRef.openCourierModel()
    },

    // 打开设置
    openSetting() { },

    // 关闭按钮
    close() {
      this.viewCourierDetail=''
      this.$emit('close')
    },

    seeDetail(data) {
      this.currentID = data.LogisticCode
      this.rightList = data
    },

    // 根据不同标识进行背景色获取
    getBgColor(data) {
      const findItem = courierType.find((item) => {
        return item.name === data.status
      })
      return findItem
    },


    getRightItem(data) {
      this.rightList = data
    },

    // 打开设置
    openSetting(){
      this.$refs.courierSettingRef.openSettingModal()
    }
  },

  async mounted() {
    this.getDbCourier()
    this.couriersList = this.courierDetailList
    if(this.viewCourierDetail){
      console.log(this.viewCourierDetail)
      this.rightList=this.viewCourierDetail
      this.currentID=this.viewCourierDetail?.LogisticCode
    }else{
      this.rightList = this.couriersList[0]
      this.currentID=this.couriersList[0]?.LogisticCode
    }
    
    // this.viewCourierDetail=''
    // console.log(this.couriersList[0],'couriersList');
  },

  watch:{
    'defaultFlow':{
      handle(newVal){
        // console.log('查看',newVal);
        this.defaultFlow = newVal
      },
      immediate:true,
      deep:true
    }
  }

};
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
  -webkit-line-clamp: 2;
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
</style>