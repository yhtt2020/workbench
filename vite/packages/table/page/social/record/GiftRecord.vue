<template>
  <div class="p-8 rounded-xl" style="background: var(--primary-bg);width: 702px;">
    <!-- 空状态 -->
    <div v-if="testData.length === 0">
      <div class="flex justify-between items-center">
        <div v-for="item in giftColumns" class="secondary-title">
          {{ item.title }}
        </div>
      </div>
      <div class="flex items-center justify-center py-10">
        <a-empty :image="simpleImage" :description="暂无数据"></a-empty>
      </div>
    </div>

    <!-- 账单记录列表数据展示区域 -->
    <a-table v-else :columns="giftColumns" :data-source="testData" :pagination="{ pageSize: 10 }"  :scroll="{ y: 400 }">
      <template #bodyCell="{ column }">
        <template v-if="column.dataIndex === 'beFrom'">
          
        </template>
        <template v-if="column.dataIndex === 'controls'">
          <div>详情</div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import {testData, giftColumns} from '../../../js/data/tableData'
import _ from 'lodash-es'
export default {
  data(){
    return{
      testData,
      giftColumns,
      simpleImage:'/img/state/null.png'  // 空状态图标
    }
  },
}
</script>

<style lang="scss" scoped>
.secondary-title{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.60);
  font-weight: 400;
}





:deep(.ant-table-body){
  overflow-y: scroll;
  &::-webkit-scrollbar{
    width: 0 !important;
  }
}
:deep(.ant-table-thead > tr > th){
  background: transparent !important;
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
</style>