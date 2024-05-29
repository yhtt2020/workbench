<template>
<a-table class="order-table" :scroll="{x:600,scrollToFirstRowOnChange:true}" :data-source="list" :columns="cols">
  <template #bodyCell="{ column, record }">
    <template v-if="column.key === 'goods_name'">
      <div style="word-break: break-all">
        <a-image :height="50" :preview="true" :src="record.goods_thumbnail_url" :width="50"></a-image>
        {{ record.goods_name }}

      </div>

    </template>
    <template v-if="column.key === 'nickname' && record.userInfo">
      <div class="pointer" style="word-break: break-all"
           @click="showUserCard(record.userInfo.uid,record.userInfo)">
        <a-avatar :size="30" :src="record.userInfo.avatar"></a-avatar>
        {{ record.nickname }}

      </div>

    </template>
    <div v-else-if="column.key === 'nickname'">系统订单</div>
    <template v-if="column.key === 'order_status_desc'">
      <div class="pointer" style="word-break: break-all">
        {{ record.order_status_desc }}
        <div class="xt-text-2" v-if="record.order_status===4">
          {{record.fail_reason}}
        </div>
      </div>

    </template>
  </template>
</a-table>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {goodsStore} from "./goodsStore";
const {getOrderList} =goodsStore()
const list=ref([])
const page=ref(1)
const cols=[
  {
    title: '推广用户',
    width: 200,
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '支付时间',
    width: 200,
    dataIndex: 'order_pay_time_str',
    key: 'order_pay_time_str',
  },
  {
    title: '订单号',
    width: 200,
    dataIndex: 'order_id',
    key: 'order_id',
  },
  {
    title: '商品信息',
    width: 300,
    minWidth: 300,
    resizable: true,
    dataIndex: 'goods_name',
    key: 'goods_name',
  },
  {
    width: 200,
    title: '店铺',
    dataIndex: 'mall_name',
    key: 'mall_name',
  },
  {
    width: 200,
    title: '订单状态',
    dataIndex: 'order_status_desc',
    key: 'order_status_desc',
  },
  {
    width: 200,
    title: '推广类型',
    dataIndex: 'type_str',
    key: 'type_str',
  },
  {
    width: 200,
    title: '订单金额',
    dataIndex: 'order_amount',
    key: 'order_amount',
  },
  {
    width: 200,
    title: '佣金比例',
    dataIndex: 'promotion_rate',
    key: 'promotion_rate',
  },
  {
    width: 200,
    title: '预估佣金收入（元）',
    dataIndex: 'promotion_amount',
    key: 'promotion_amount',
  },
  {
    width: 200,
    title: '备注',
    dataIndex: 'activationTime',
    key: 'activationTime',
  },
]
const refreshData=async ()=>{
  let rs=await getOrderList(page.value)
  if(rs.status){
    list.value = rs.data.list
    for (const order of list.value) {
      order.order_pay_time_str = (new Date((+order.order_pay_time) * 1000)).toLocaleString()
      order.order_amount = order.order_amount / 100
      order.promotion_amount = order.promotion_amount / 100
      order.promotion_rate = (order.promotion_rate / 10) + '%'
      order.type_str = convertType(order.type)
    }
  }
}
const convertType =(type) =>{
  const types = {
    0: '单品推广',
    1: '红包活动推广',
    4: '多多进宝商城推广',
    7: '今日爆款',
    8: '品牌清仓',
    9: '1.9包邮',
    64: '跨店关联',
    77: '刮刮卡活动推广',
    94: '充值中心',
    101: '品牌黑卡',
    103: '百亿补贴频道',
    104: '内购清单频道',
    105: '超级红包'
  }
  return types[type]
}
onMounted(()=>{
  refreshData()
})
</script>

<style scoped lang="scss">
.order-table {
  :deep( .ant-table-cell) {
    white-space: nowrap
  }
}
</style>
