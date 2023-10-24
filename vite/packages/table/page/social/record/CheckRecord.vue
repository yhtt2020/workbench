<template>
  <div class="p-4 rounded-xl" style="background: var(--primary-bg);width: 702px;">
    <!-- 空状态 -->
    <div v-if="testData.length === 0">
      <div class="flex justify-between items-center">
        <div v-for="item in checkColumns" class="secondary-title" style="color: var(--secondary-text);">
          {{ item.title }}
        </div>
      </div>
      <div class="flex items-center justify-center py-10">
        <a-empty :image="simpleImage" description="暂无账单记录"></a-empty>
      </div>
    </div>

    <!-- 账单记录列表数据展示区域 -->
    <a-table v-else :columns="checkColumns" :data-source="testData" :pagination="{ pageSize: 10 }"  :scroll="{ y: 400 }">
      <template #bodyCell="{ column,index,record}">
        <template v-if="column.dataIndex === 'controls'">
          <div v-if="index === 0" class="rounded-xl pointer button-active h-10 flex items-center justify-center" style="background:rgba(250,173,20, 0.1);">
            <span class="secondary-title" style="color: rgba(250,173,20, 1);">去支付</span>
          </div>
          <div v-else class="rounded-xl pointer button-active h-10 flex items-center justify-center"
           style="background: var(--active-secondary-bg);" @click="goDetails(record)">
            <span class="secondary-title" style="color: var(--active-bg);">详情</span>
          </div>
        </template>
      </template>
    </a-table>

  </div>

  <Modal v-model:visible="checkDetailShow" v-show="checkDetailShow" :blurFlag="true">
    <div style="width: 480px;" class="flex flex-col">
      <div class="w-full flex p-3 mb-6">
        <div style="width: 90%;" class="flex items-center justify-center">
          <span class="primary-title pl-10" style="color: var(--primary-text);">订单详情</span>
        </div>
        <div class="p-3 flex items-center pointer justify-center button-active rounded-lg" style="background: var(--secondary-bg);" @click="checkDetailShow = false">
          <Icon icon="guanbi" style="font-size: 1.45em;"></Icon>
        </div>
      </div>
      <div class=" w-full px-10 pb-10">
        <div style="width: 400px;background: var(--secondary-bg);" class="flex items-center rounded-xl p-4 mb-6">
          <div class="w-16 h-16 mr-4">
            <img :src="checkDetailsData.frame_url" class="w-full h-full object-cover" alt="">
          </div>
          <div class="flex  flex-col">
            <span class="primary-title" style="color: var(--primary-text);">{{ checkDetailsData.frame_name }}</span>
            <span class="secondary-title" style="color: var(--secondary-text);">道具</span>
          </div>
        </div>
        <div class="flex flex-col rounded-xl p-4" style="width: 400px;background: var(--secondary-bg);">
          <div class="flex w-full justify-between">
            <span class="secondary-title" style="color: var(--secondary-text);">支付时间</span>
            <span class="primary-title" style="color: var(--primary-text);">{{checkDetailsData.date}}</span>
          </div>
          <div class="flex w-full justify-between my-5">
            <span class="secondary-title" style="color: var(--secondary-text);">支付金额</span>
            <span class="bold-title" style="color: var(--primary-text);">{{checkDetailsData.price}}</span>
          </div>
          <div class="flex w-full justify-between mb-5">
            <span class="secondary-title" style="color: var(--secondary-text);">支付方式</span>
            <span class="primary-title" style="color: var(--primary-text);">微信</span>
          </div>
          <div class="flex w-full justify-between">
            <span class="secondary-title" style="color: var(--secondary-text);">订单编号</span>
            <span class="primary-title" style="color: var(--primary-text);">{{checkDetailsData.order_number}}</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import {testData,checkColumns} from '../../../js/data/tableData'
import Modal from '../../../components/Modal.vue'
export default {
  components:{
    Modal
  },
  data(){
    return{
      testData,
      checkColumns,
      simpleImage:'/img/state/null.png',  // 空状态图标
      checkDetailShow:false,
      checkDetailsData:{}
    }
  },
  methods:{
    goDetails(record){
      this.checkDetailShow = true
      this.checkDetailsData.frame_url = record.frame_url
      this.checkDetailsData.frame_name = record.name
      this.checkDetailsData.date = record.date
      this.checkDetailsData.price = record.price
      this.checkDetailsData.order_number = record.order_number
    }
  }
}
</script>

<style lang="scss" scoped>
.secondary-title{
  font-size: 16px;
  font-weight: 400;
}

.primary-title{
  font-size: 16px;
  font-weight: 500;
}

.bold-title{
  font-family:Oswald;
  font-size: 16px;
  font-weight: 400;
}

.button-active{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}



:deep(.ant-table-body){
  overflow-y: scroll;
  &::-webkit-scrollbar{
    width: 0 !important;
  }
  color: var(--primary-text) !important;
}

:deep(.ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover){
  color: var(-active-text) !important;
  opacity: 0.8 !important;
  background: transparent !important;
}

:deep(.ant-table-thead > tr > th){
  background: transparent !important;
  color: var(--primary-text) !important;
  border: none !important;
}
:deep(.ant-table){
  background: var(--primary-bg) !important;
  border-radius: 10px !important;
}
:deep(.ant-table-container table > thead > tr:first-child th:first-child){
  border-top-left-radius: 10px !important;
}
:deep(.ant-table-container table > thead > tr:first-child th:last-child){
  border-top-right-radius: 10px !important;
}
:deep(.ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before){
  width: 0 !important;
  height: 0 !important;
}

:deep(.ant-table-tbody > tr:last-child > td){
  border: none !important;
}
:deep(.ant-table-tbody > tr:last-child > td:first-child){
  border-bottom-left-radius: 10px !important;
}
:deep(.ant-table-tbody > tr:last-child > td:last-child){
  border-bottom-right-radius: 10px !important;
}
:deep(.ant-table-tbody > tr > td){
  border-bottom: 1px solid var(--divider) !important;
}
</style>
