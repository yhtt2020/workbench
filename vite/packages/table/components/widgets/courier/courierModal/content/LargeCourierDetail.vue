<template>
  <div class="flex flex-col" style="width: 976px;height: 600px;">
    <div class="flex items-center justify-center w-full py-4 mb-4" style="position: relative;">
      <div class="flex">
        <HorizontalPanel :navList="tabList.slice(0,4)" v-model:selectType="defaultFlow" />
        <DropDown class="ml-3" :navList="tabList.slice(4)" @selectType="getSelectType"></DropDown>
      </div>
      <div class="flex right-button">
        <DropIndex :navList="addList"></DropIndex>
        <a-tooltip placement="top" class="mr-3" title="设置">
          <xt-button w="32" h="32"  @click="openSetting" style="border-radius: 8px !important;">
            <div class="flex items-center justify-center">
              <SmallIcon icon="fluent:settings-16-regular" class="xt-text-2" style="font-size: 1.25rem;" />
            </div>
          </xt-button>
        </a-tooltip>
        <a-tooltip placement="top" title="关闭">
          <xt-button w="32" h="32"  @click="close" style="border-radius: 8px !important;">
            <div class="flex items-center justify-center">
              <SmallIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;" />
            </div>
          </xt-button>
        </a-tooltip>
      </div>
    </div>

    <Empty v-if="courierDetailList.length === 0"  :exampleVisible="true"/>

    <template v-else>
      <template v-if="detailList?.length === 0">
        <Empty :exampleVisible="true"/>
      </template>
      <div class="flex w-full justify-between px-6" v-else>
        <div style="width:452px;" class="flex flex-col">
          <template v-if="allShow">
            <SortList  :list="courierDetailList" @rightSelect="getRightItem"/>
          </template>
          <template v-else>
            <div style="width: 455px;" class="flex flex-col mr-4">
              <vue-custom-scrollbar :settings="settingsScroller" style="height:500px;">
                <div v-for="(item,index) in detailList"  class="flex p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item" 
                :class="{ 'select': currentID === index }" 
                >
                  <xt-menu name="name" @contextmenu="revID = index" :menus="menus">
                    <div class="flex  justify-between"  @click.prevent="detailClick(item,index)">
                      <div class="flex items-center justify-center mr-4 rounded-lg w-14 h-14" style="background: var(--mask-bg);">
                        <SmallIcon icon="fluent-emoji:package" style="font-size: 2rem;" />
                      </div>
                      <div class="flex flex-col" style="max-width: 360px;">
                        <div class="flex items-center justify-between " >
                          <span class="xt-font font-16 font-600">
                            {{ item.LogisticCode }}
                          </span>
        
                          <div class="flex">
                            <div class="flex xt-text-2" style="font-size: 14px;text-align: center;">
                              <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2">
                                {{ switchCompany(item) }}
                              </div>
                              <div class="flex items-center pl-1 pr-1 rounded-md" :style="{ 'background': stateColor(item) }">
                                {{ switchState(item) }}
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
              </vue-custom-scrollbar>
            </div>
          </template>
        </div>

        <div style="width:452px;">
          <RightDetail :detail="rightDetail"/>
        </div>
      </div>
    </template>
  </div>

  <AddCourierModal ref="addCourierRef" />

  <CourierSetting ref="courierSettingRef" />
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { courierStore } from '../../../../../store/courier'
import { Icon as SmallIcon } from '@iconify/vue'
import { courierType,selectTab,selectData } from '../modalMock'
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


export default {
  components:{
    SmallIcon,HorizontalPanel,DropIndex,AddCourierModal,
    CourierSetting,DropDown,SortList,Empty,RightDetail
  },

  data(){
    return{
      addList:[
        { title:'京东账号',name:'jd',callBack:()=>{} }, 
        { title:'淘宝账号',name:'tb',callBack:()=>{} },
        { title:'自定义添加', icon:'fluent:add-16-filled',callBack:()=>{ this.addCourier() }}
      ],
      menus:[
        {name:'订阅物流',callBack:()=>{ },newIcon:'fluent:star-12-regular'},
        {
          name:'删除快递', newIcon:'akar-icons:trash-can', color:'var(--error)',
          callBack:()=>{ 
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
      defaultFlow:null,
      detailList:[],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      revID:'',
      currentID:'',
      rightDetail:{},
    }
  },
 
  computed:{
    ...mapWritableState(courierStore,['courierDetailList']),
    // 计算获取tab栏数据
    tabList(){
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
      return this.defaultFlow?.name === 'all'
    }
  },

  methods:{
    ...mapActions(courierStore,['removeDbData']),
    // 关闭
    close(){ this.$emit('close') },
    // 打开快递设置
    openSetting(){  this.$refs.courierSettingRef.openSettingModal() },
    // 获取下拉菜单点击后的数据
    getSelectType(item){
      this.defaultFlow = item
      this.detailList = selectData(item,this.courierDetailList)
    },

    stateColor(item) {
      return switchColor(item.State)
    },
    switchState(item) {
      return kdState(item.State)
    },
    switchCompany(item) {
      return kdCompany(item?.ShipperCode)
    },

    // 列表点击显示详情
    detailClick(item,index){
      this.currentID = index
      this.rightDetail = item
    },

    // 自定义添加快递
    addCourier(){
      this.$refs.addCourierRef.openCourierModel()
    },

    getRightItem(item){
      this.rightDetail = item
    }


  },

  mounted(){
    this.defaultFlow = this.tabList[0]
  },

  watch:{
    'defaultFlow':{
      handler(newVal){
        this.detailList = selectData(newVal,this.courierDetailList)
      },
      immediate:true,
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

:deep(.empty-content){
  height: 400px !important;
  margin: 50px 0 !important;
  justify-content: space-between !important;
}
</style>