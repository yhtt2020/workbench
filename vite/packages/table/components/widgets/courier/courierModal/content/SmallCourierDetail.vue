<template>
  <template v-if="!detailVisible">
    <div class="flex flex-col" style="width: 500px; height: 600px">
      <div  class="flex items-center justify-center py-4 mb-4" style="position: relative">
        <div class="flex items-center justify-center">
          <TopDrop :navList="typeList" v-model:selectType="currentType" />
        </div>
        <div class="flex top-right">
          <DropIndex :navList="addList" @open="addCourier"/>
          <a-tooltip placement="top" class="mr-3" title="设置">
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

      <Empty v-if="detailList?.length === 0"  :exampleVisible="false"/>

      <template v-else>
        <div class="flex items-center mb-4 justify-between px-6">
          <SelectPlateform />
          <xt-button w="40" h="40">
            <div class="flex items-center justify-center">
              <SmallIcon icon="fluent:arrow-counterclockwise-20-filled" style="1.25rem"/>
            </div>
          </xt-button>
        </div>

        <SortList :list="allList" v-if="allShow" @rightSelect="getSmallItem" @viewDetail="getDetail"/>

        <vue-custom-scrollbar :settings="settingsScroller" v-else>
          <div class="flex flex-col px-6" ref="smallSortRef" style="height: 450px;">
            <div v-for="(item,index) in detailList"  class="rounded-lg">
              <xt-menu name="name" @contextmenu="revID = {item,index}" :menus="menus">
                <div :class="{'select':currentID === index}" class="flex p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item" @click="detailClick(item,index)">
                   <div class="flex flex-col items-center">
                    <div class="flex">
                      <div class="flex items-center justify-center mr-3 rounded-lg" style="width:52px;height:52px; background: var(--mask-bg);">
                        <SmallIcon icon="fluent-emoji:package" style="font-size: 2rem;"/>
                      </div>
                      <div class="flex items-center justify-between " style="width:362px;">
                        <div class="flex flex-col">
                          <div class="flex items-center mb-1.5">
                            <div  v-if="isJd" class="w-6 h-6 flex items-center justify-center rounded-md" style="background:#E12419;"> JD </div>
                            <div v-if="isTb" class="w-6 h-6 flex items-center justify-center rounded-md" style="background:#FA5000;"> 淘 </div>
                            <span class="xt-font font-16 font-600 mx-1.5">
                              {{ item.LogisticCode }}
                            </span>
                            <SmallIcon v-if="true" icon="fluent:star-12-regular" style="font-size: 1.25rem;"/>
                            <SmallIcon icon="fluent:star-16-filled" v-else style="color:var(--warning);font-size: 1.25rem;"/>
                          </div>
                          <div class="flex">
                            <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg " style="width:68px;">
                              {{ switchCompany(item) }}
                            </div>
                            <div v-if="false" class="flex items-center justify-center rounded-md w-6 h-6 xt-text-2 xt-bg">拆</div>
                          </div>
                        </div>
                        <div class="flex flex-col items-center justify-end">
                          <div class="flex items-center ml-8 mb-2 pl-1 pr-1 rounded-md" :style="{ 'background': stateColor(item,index)}">
                            {{ switchState(item) }}
                          </div>
                          <span v-if="false" class="xt-text-2 font-14 font-400">预计明天到达</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col">
                      <div class="my-2">{{ item.Traces[item.Traces.length - 1]?.AcceptTime  }}</div>
                      <div class="summary">
                      {{ item.Traces[item.Traces.length - 1]?.AcceptStation }}
                      </div>
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
    <LogisticsDetail :orderNum="detailItem" @close="close" @back="detailVisible = false"/>
  </template>


  <AddCourierModal ref="addCourierRef"/>
  <CourierSetting ref="courierSettingRef"/>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { courierStore } from '../../../../../apps/ecommerce/courier'
import { courierType,selectData,selectTab } from '../modalMock'
import { Icon as SmallIcon } from '@iconify/vue'
import { kdCompany, kdState, switchColor } from '../../mock'
import { Modal,message } from 'ant-design-vue'
import { appStore } from '../../../../../store'

import TopDrop from "../dropdown/index.vue";
import DropIndex from '../dropdown/DropIndex.vue';
import Empty from '../../Empty.vue'
import SortList from "../dropdown/SmallSortList.vue";
import CourierSetting from '../CourierSetting.vue';
import AddCourierModal from '../AddCourierModal.vue';
import LogisticsDetail from '../content/LogisticsDetail.vue';
import SelectPlateform from '../dropdown/SelectPlateform.vue'

export default {
  props:['list'],

  components:{
    TopDrop,DropIndex,SmallIcon,Empty,SortList,CourierSetting,
    AddCourierModal,LogisticsDetail,SelectPlateform
  },

  data(){
    return{
      currentType:{},
      addList:[
        { title:'京东账号',name:'jd', callBack:()=>{}},
        { title:'淘宝账号',name:'tb',   callBack:()=>{}},
        {
          title:'自定义添加',   icon:'fluent:add-16-filled',
          callBack:()=>{ this.addCourier()}
        }
      ],
      menus:[
        {
          name:'查看详情',  newIcon:'fluent:apps-list-detail-24-regular',
          callBack:()=>{
            this.currentID = this.revID.index
            this.detailVisible = true
            this.detailItem = this.revID.item
          },
        },
        {
          name:'订阅物流',newIcon:'fluent:star-12-regular',
          callBack:()=>{},
        },
        {
          name:'删除快递',newIcon:'akar-icons:trash-can', color:'var(--error)',
          callBack:()=>{
            Modal.confirm({
             content: '确认删除当前快递物流信息',
             centered: true,
             onOk: () => {
              this.removeDbData(this.revID)
              message.success('删除成功')
             }
            })
          }
        }
      ],
      detailList:[],
      revID:'',
      detailItem:{},
      currentID:'',
      detailVisible: false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },

  computed:{
    ...mapWritableState(courierStore,['courierDetailList']),
    ...mapWritableState(appStore,['settings']),
    typeList(){
      if(this.courierDetailList.length !== 0){
        const list = courierType.map((item)=>{
          return selectTab(item,this.courierDetailList)
        })
        return list
      }else{
        return courierType
      }
    },
    allShow(){
      return this.currentType?.name === 'all'
    },
    allList(){
      const item = this.typeList[0]
      return selectData(item,this.courierDetailList)
    }
  },

  methods:{
    ...mapActions(courierStore,['removeDbData']),
    close(){ this.$emit('close') },
    stateColor(item) {
      return switchColor(item.State)
    },
    switchState(item) {
      return kdState(item.State)
    },
    switchCompany(item) {
      return kdCompany(item?.ShipperCode)
    },
    addCourier(){
      this.$refs.addCourierRef.openCourierModel()
    },
    // 打开设置弹窗
    openSetting(){
      this.$refs.courierSettingRef.openSettingModal()
    },
    getSmallItem(item){
      console.log('查看item',item);
      this.detailItem = item
      this.detailVisible = true
    },
    detailClick(item,index){
    console.log('查看item',item);
     this.currentID = index
     this.detailItem = item
     this.detailVisible = true

    },
    getDetail(revID){
      console.log('查看item',revID.item);
      this.currentID = revID.index
     this.detailVisible = true
     this.detailItem = revID.item
    }
  },

  mounted(){
    this.currentType = this.typeList[0]
  },

  watch:{
    'currentType':{
      handler(newVal){
        if(this.courierDetailList.length !== 0){
          this.detailList = selectData(newVal,this.courierDetailList)
        }
      },
      immediate:true
    }
  }
};
</script>

<style lang="scss" scoped>
.top-right{
  position: absolute;
  top: 11px;
  right: 16px;
}

.summary{
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

.select{
  background: var(--active-secondary-bg) !important;
}

:deep(.empty-content){
  height: 400px !important;
  margin: 50px 0 !important;
  justify-content: center !important;
}
</style>
