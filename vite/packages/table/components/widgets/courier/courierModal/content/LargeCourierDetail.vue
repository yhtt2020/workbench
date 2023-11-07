<template>
  <div class="flex flex-col" style="width: 976px;height: 600px;">
    <div class="flex items-center justify-center w-full py-4" style="position: relative;">
      <div class="flex">
        <HorizontalPanel :navList="tabList.slice(0,4)" v-model:selectType="defaultFlow" />
        <DropDown class="ml-3" :navList="tabList.slice(4)" @selectType="getSelectType"></DropDown>
      </div>
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

    <template v-if="detailList.length === 0">
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
          <SortList  :list="allList"  @rightSelect="getRightItem"/>
          <div style="width: 452px;" v-if="rightList !== null">
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
              <div v-for="(item,index) in detailList" :class="{ 'select': currentID === item.LogisticCode }"
                class="flex p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item" @click="seeDetail(item)">
                <xt-menu name="name" @contextmenu="revID = index" :menus="menus">
                  <div class="w-full flex justify-between">
                    <div class="flex items-center justify-center mr-4 rounded-lg w-14 h-14" style="background: var(--mask-bg);">
                      <SmallIcon icon="fluent-emoji:package" style="font-size: 2rem;" />
                    </div>
                    <div class="flex flex-col">
                      <div class="flex items-center justify-between " style="width: 300px;">
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
              <div style="height: 12px;"></div>
            </vue-custom-scrollbar>
          </div>
          <div style="width: 452px;" v-if="rightList !== null">
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
import { defineComponent,toRefs,ref,reactive,computed,onMounted,watch} from 'vue'
import { storeToRefs } from 'pinia'
import { courierType,selectTab,selectData } from '../modalMock'
import { courierStore } from '../../../../../store/courier'
import { Icon as SmallIcon } from '@iconify/vue'
import { kdCompany, kdState, switchColor } from '../../mock'

import HorizontalPanel from '../../../../HorizontalPanel.vue'
import AddCourierModal from '../AddCourierModal.vue'
import CourierSetting from '../CourierSetting.vue'
import DropIndex from '../dropdown/DropIndex.vue'
import DropDown from '../dropdown/MoreDrop.vue'
import SortList from '../dropdown/SortList.vue'
import TimeLine from '../timeLine/index.vue'
import UpdateIcon from '../updateIcon/index.vue'

export default defineComponent({
  components:{
    HorizontalPanel,SmallIcon,AddCourierModal,UpdateIcon,
    CourierSetting,DropIndex,DropDown,SortList,TimeLine
  },

  setup(props,ctx) {
    const courier = courierStore()
    const { courierDetailList } = storeToRefs(courier)
    
    // 顶部tab栏数据
    const tabList = computed(()=>{
      if(courierDetailList.value.length !== 0){
        const list = courierType.map((item)=>{
          return selectTab(item,courierDetailList.value)
        })
        return list
      }else{
        return courierType
      }
    })

    const defaultFlow = ref(tabList.value[0])
    const addCourierRef = ref(null)
    const courierSettingRef = ref(null)

    const data = reactive({
      addList:[
        { title:'京东账号',name:'jd',callBack:()=>{} },
        { title:'淘宝账号',name:'tb',callBack:()=>{} },
        { title:'自定义', icon:'fluent:add-16-filled',
          callBack:()=>{
            addCourier()
          }
        },
      ],
      detailList:[],
      allList:courierDetailList.value,
      rightList:null,
       settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      currentID:'',
      menus:[
      { name:'订阅物流', callBack:()=>{}, newIcon:'fluent:star-12-regular' },
      {
       name:'删除快递',newIcon:'akar-icons:trash-can', color:'var(--error)',
       callBack:()=>{
        Modal.confirm({
          content: '确认删除当前快递物流信息',
          centered: true,
          onOk: () => {
            this.removeSortData(this.revID)
            this.removeDbData(this.revID)
          } 
        })
      
       },
       
      },
      ],
    })

    const allVisible = computed(()=>{
      return defaultFlow.value.name === 'all'
    })

    const addCourier = () =>{
      addCourierRef.value.openCourierModel()
    }

    const close = () =>{
      ctx.emit('close')
    }

    // 打开设置
    const openSetting = () =>{
      courierSettingRef.value.openSettingModal()
    }

    const getSelectType = (item) =>{
      defaultFlow.value = item
      console.log('查看数据',selectData(item,courierDetailList.value));
      data.detailList = selectData(item,courierDetailList.value)
    }

    watch(()=>defaultFlow.value,(newVal)=>{
     data.detailList = selectData(newVal,courierDetailList.value)
    },{immediate:true})

    const getRightItem = (item) =>{
     data.rightList = item
    }

    const stateColor = (item) =>{
      return switchColor(item.State)
    } 

    const switchState = (item) =>{
      return kdState(item.State)
    }

    const switchCompany = (item) =>{
      return kdCompany(item.ShipperCode)
    } 

    const seeDetail = (item) =>{
      console.log('查看item',item);
      // data.rightList = item
    }

    

    return{
      tabList,defaultFlow,courierSettingRef,addCourierRef,courierDetailList,
      getSelectType,allVisible,getRightItem,stateColor,
      ...toRefs(data),addCourier,close,openSetting,switchState,switchCompany,seeDetail
    }
  }
})

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