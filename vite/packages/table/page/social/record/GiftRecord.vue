<template>
  <div class="p-4 rounded-xl" style="background: var(--primary-bg);width: 702px;">
    <!-- 空状态 -->
    <div v-if="testData.length === 0">
      <div class="flex justify-between items-center">
        <div v-for="item in giftColumns" class="secondary-title">
          {{ item.title }}
        </div>
      </div>
      <div class="flex items-center justify-center py-10">
        <a-empty :image="simpleImage" description="暂无账单记录"></a-empty>
      </div>
    </div>

    <!-- 账单记录列表数据展示区域 -->
    <a-table :pagination="{ pageSize: 10 }"  :dataSource="testData" :columns="giftColumns"
    :scroll="{y: 480 }"
    >
      <template #bodyCell="{ column,record }">
        <template v-if="column.key === 'user'">
          <div class="text-center truncate">
            <a-avatar :src="record.user.avatar_url"></a-avatar>&nbsp;
            <span style="color: var(--primary-text);">{{ record.user.username }}</span>
          </div>
        </template>
        <template v-if="column.dataIndex === 'controls'">
          <div class="rounded-xl pointer button-active h-10 flex items-center justify-center"
           style="background: var(--active-secondary-bg);" @click="receiveGift(record)"
          >
            <span class="secondary-title" style="color: var(--active-bg);">领取</span>
          </div>
        </template>
      </template>
    </a-table>
  </div>

  <Modal v-model:visible="giftDetailShow" v-show="giftDetailShow" :blurFlag="true">
    <div style="width: 480px;" class="flex flex-col">
      <div class="w-full flex p-3 mb-6">
        <div style="width: 90%;" class="flex items-center justify-center">
          <span class="primary-title pl-10" style="color: var(--primary-text);">恭喜获得</span>
        </div>
        <div class="p-3 flex items-center pointer justify-center button-active rounded-lg" style="background: var(--secondary-bg);" @click="giftDetailShow = false">
          <Icon icon="guanbi" style="font-size: 1.45em;"></Icon>
        </div>
      </div>
      <div class=" w-full px-10 pb-10">
        <div style="width: 400px;background: var(--secondary-bg);" class="flex items-center rounded-xl p-4 mb-6">
          <div class="w-16 h-16 mr-4">
            <img :src="giftData.frame_url" class="w-full h-full object-cover" alt="">
          </div>
          <div class="flex  flex-col">
            <span class="primary-title" style="color: var(--primary-text);">{{ giftData.frame_name }}</span>
            <span class="secondary-title" style="color: var(--secondary-text);">道具</span>
          </div>
        </div>
        <div class="w-full flex items-center justify-center">
          <a-button class="mr-3 rounded-lg" style="background: var(--secondary-bg);">稍后再说</a-button>
          <a-button type="primary" class="rounded-lg" style="color: var(--active-text);">立即使用</a-button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import {testData, giftColumns} from '../../../js/data/tableData'
import Modal from '../../../components/Modal.vue'
import _ from 'lodash-es'
export default {
  components:{
    Modal
  },
  data(){
    return{
      testData,
      giftColumns,
      simpleImage:'/img/state/null.png',  // 空状态图标
      giftDetailShow:false,
      giftData:{},
    }
  },
  methods:{
    receiveGift(record){
      this.giftDetailShow = true
      this.giftData.frame_url = record.frame_url
      this.giftData.frame_name = record.name
    },
  }
}
</script>

<style lang="scss" scoped>
.secondary-title{
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


.primary-title{
  font-size: 16px;
  font-weight: 500;
}

:deep(.ant-table){
  background: transparent !important;
}

:deep(.ant-table-body){
  overflow-y: scroll;
  &::-webkit-scrollbar{
    width: 0 !important;
  }
  color: var(--primary-text) !important;
}

:deep(.ant-table-tbody > tr > td){
  border-bottom:1px solid var(--divider) !important;
}

:deep(.ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover){
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
:deep(.ant-table-fixed .ant-table-row-hover,.ant-table-row-hover>td){
  background-color: transparent !important;
}
</style>

<style scoped>
.table-row:hover {
  background-color: transparent;
}
</style>
