<template>
  <template v-if="!detailVisible">
    <div class="flex flex-col" style="width: 500px; height: 600px">
      <div  class="flex items-center justify-center h-16 mb-4" style="position: relative">
        <TopDrop :navList="typeList" v-model:selectType="currentType" />
        <div class="flex top-right">
          <DropIndex :navList="addList" />

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
      <template v-if="filterList?.length === 0 && otherList?.length === 0">
        <div class="flex flex-col items-center justify-center px-6" style="height:calc(100% - 64px)">
          <SmallIcon icon="fluent-emoji:package" style="font-size: 3.5rem;"/>
          <div class="px-4 py-3 my-4 rounded-lg font-14 font-400 xt-bg-2 xt-text">
            在桌面上时刻关注你的快递动态，支持批量添加快递单号，自定义修改快递名称和图标。
          </div>
          <xt-button w="95" type="theme" h="40" @click="addCourier">添加快递</xt-button>
        </div>
      </template>

      <template v-else>
        <SortList :list="filterList" v-if="allVisible" :sortItem="sortItem" @rightSelect="getSmallItem" />
        <vue-custom-scrollbar :settings="settingsScroller" v-else>
          <div class="flex flex-col px-6" ref="smallSortRef" style="height:calc(100% - 64px);">
            <div v-for="(item,index) in otherList"  class="rounded-lg">
              <xt-menu name="name" @contextmenu="revID = index" :menus="menus">
                <div :class="{'select':currentID === item.LogisticCode}" class="flex p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item" @click="seeDetail(item)">
                  <div class="flex items-center justify-center mr-4 rounded-lg w-14 h-14" style="background: var(--mask-bg);">
                    <SmallIcon icon="fluent-emoji:package" style="font-size: 2rem;"/>
                  </div>
                  <div class="flex flex-col" style="width: calc(100% - 84px);">
                    <div class="flex items-center justify-between ">
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
                    <div class="my-2">{{ item.Traces[item.Traces.length - 1]?.AcceptTime  }}</div>
                    <div class="summary">
                      {{ item.Traces[item.Traces.length - 1]?.AcceptStation }}
                    </div>
                  </div>
                </div>
              </xt-menu>
            </div>
            <div style="height: 12px;"></div>
          </div>
        </vue-custom-scrollbar>
      </template>
    </div>
  </template>

  <template v-else> 
    <LogisticsDetail :orderNum="seeItem" @close="close" @back="detailVisible = false"/>
  </template>

  <AddCourierModal ref="addCourierRef"/>

  <CourierSetting ref="courierSettingRef"/>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { courierModalStore } from '../courierModalStore'
import { courierType } from '../modalMock'
import { Icon as SmallIcon } from '@iconify/vue'
import { courierStore } from '../../../../../store/courier'

import TopDrop from "../dropdown/index.vue";
import SortList from "../dropdown/SmallSortList.vue";
import AddCourierModal from '../AddCourierModal.vue';
import LogisticsDetail from '../content/LogisticsDetail.vue';
import { kdCompany, kdState, switchColor } from '../../mock'

import CourierSetting from '../CourierSetting.vue';
import DropIndex from '../dropdown/DropIndex.vue';

export default {
  props: ["list"],

  components: {
    SortList,
    TopDrop,
    AddCourierModal,
    SmallIcon,
    LogisticsDetail,
    CourierSetting,
    DropIndex
  },

  data() {
    return {
      detailVisible: false,
      currentType:{title:`全部${this.list.length !== 0 ? `(${this.list.length})` : '' }`,name:'all'},
      seeItem:{},
      currentID:this.list[0]?.LogisticCode,
      // item.LogisticCode

      settingsScroller: { 
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },

      revID:'',
      menus:[
       {
        name:'查看详情',
        callBack:()=>{},
        newIcon:'fluent:apps-list-detail-24-regular'
       },
       {
        name:'订阅物流',
        callBack:()=>{},
        newIcon:'fluent:star-12-regular'
       },
       {
        name:'删除快递',
        callBack:()=>{
          console.log(this.revID);
          this.removeDbData(Number(this.revID))
        },
        newIcon:'akar-icons:trash-can',
        color:'var(--error)'
       },
      ],

      sortItem:{},

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
      ],
      
    };
  },

  computed: {
   ...mapWritableState(courierModalStore,['smallSortList']),

    typeList() {
      const allLength = this.list.length;
      //  揽收
      const received = this.list.filter((item) => { return item.State === '1' })
      //  签收
      const hasSigned = this.list.filter((item) => { return item.State === '3' })
      //  在途中--包括在途中，问题件，转寄，清关的快递件
      const onWay = this.list.filter((item) => { return item.State !== '1' && item.StateEx !== '202' && item.State !== '3' })
      //  派件中
      const outDelivery = this.list.filter((item) => { return item.StateEx === '202' })
      const list = [...courierType];
      const filterList = list.map((item) => {
        switch (item.name) {
          case "all":
            return {
              title: `${item.title}${
                allLength.length !== 0 ? `(${allLength})` : ""
              }`,
              name: item.name,
              type: item.type,
            };
          case "collect":
            return {
              title: `${item.title}${
                received.length !== 0 ? `(${received.length})` : ""
              }`,
              name: item.name,
              type: item.type,
            };
          case "enRoute":
            return {
              title: `${item.title}${
                onWay.length !== 0 ? `(${onWay.length})` : ""
              }`,
              name: item.name,
              type: item.type,
            };
          case "delivery":
            return {
              title: `${item.title}${
                outDelivery.length !== 0 ? `(${outDelivery.length})` : ""
              }`,
              name: item.name,
              type: item.type,
            };
          case "signed":
            return {
              title: `${item.title}${
                hasSigned.length !== 0 ? `(${hasSigned.length})` : ""
              }`,
              name: item.name,
              type: item.type,
            };
        }
      });
      return filterList;
    },

    filterList(){
      if(this.allVisible){
        if(this.smallSortList.length !== 0){
          return this.smallSortList
        }else{
          return this.list;
        }
      }
    },

    allVisible(){
      return this.currentType.name === 'all';
    },

    otherList(){
      switch (this.currentType.name){
        case 'collect':
         return  this.list.filter((item)=>{ return item.State === '1' });
        case 'enRoute':
         return this.list.filter((item)=>{ return item.State !== '1' && item.StateEx !== '202' && item.State !== '3' });
        case 'delivery':
         return this.list.filter((item)=>{ return item.StateEx === '202' });
        case 'signed':
         return this.list.filter((item)=>{ return item.State === '3' });
      }
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

  methods:{
    ...mapActions(courierStore,['removeDbData','getDbCourier']),

    close(){
      this.$emit('close')
    },
    addCourier(){
      this.$refs.addCourierRef.openCourierModel()
    },

    // 根据不同标识进行背景色获取
    getBgColor(data){
     const findItem = courierType.find((item)=>{
      return item.name === data.status
     })
     return findItem
    },

    // 查看快递详情
    seeDetail(data){
     console.log('排查问题',data);
     this.currentID = data.LogisticCode
     this.seeItem = data
     this.detailVisible = true
    },

    getSmallItem(data){
      // console.log('排查问题',data);
      // this.currentID = data.id
      this.sortItem = data
      this.seeItem = data
      this.detailVisible = true
    },

    // 打开设置弹窗
    openSetting(){
      this.$refs.courierSettingRef.openSettingModal()
    }

  }


};
</script>

<style lang="scss" scoped>
.top-right{
  position: absolute;
  top: 16px;
  right: 16px;
}
 
 /**
 :deep(.courier-item){
   &:hover{
     background: var(--active-secondary-bg) !important;
   }
 }
 **/
 
 .summary{
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
 
 .select{
   background: var(--active-secondary-bg) !important;
 }
</style>




