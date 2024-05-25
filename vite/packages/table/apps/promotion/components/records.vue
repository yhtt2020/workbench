<template>
  <div>
    <div class="flex flex-box">
      <div class="box-title">推广记录</div>
      <div class="flex" style="width: 100%;justify-content: space-between;">
        <div v-for="(item,index) in cardList" class="list-box">
          <div class="list-title">{{ item.title }}</div>
          <div class="list-num">{{ item.num }}</div>
        </div>
      </div>
      <!-- 筛选条件 -->
      <div class="search-box">
        <input v-model="search.userId" class="input ant-input" placeholder="用户昵称、UID" style="width:200px;"
               type="text">
        <a-select
          v-model:selValue="selValue" :bordered="false" :filter-option="filterOption"
          :options="sortType"
          class="select input rounded-lg  text-xs flex items-center"
          placeholder="用户类型"
          show-search
          size="large"
          style="width: 160px"
          @change="handleChange"
        ></a-select>
        <input v-model="search.keyCode" class="input ant-input" placeholder="口令" style="width:200px;" type="text">
        <input v-model="search.promoterId" class="input ant-input" placeholder="推广员昵称、UID" style="width:200px;"
               type="text">
        <input v-model="search.higherId" class="input ant-input" placeholder="上级推广员昵称、UID" style="width:200px;"
               type="text">
        <a-date-picker v-model:value="search.redemptionTime" class="input ant-input" placeholder="兑换时间"
                       style="width:160px;"/>
        <a-select
          v-model:selValue="orderStatus" :bordered="false" :filter-option="filterOption"
          :options="orderStatusOption"
          class="input select rounded-lg  text-xs flex items-center "
          placeholder="订单状态"
          show-search
          size="large"
          style="width: 160px"
          @change="handleChange"
        ></a-select>
        <a-date-picker v-model:value="search.activationTime" class="input ant-input" placeholder="激活时间"
                       style="width:160px;"/>
        <div @click="refreshData" class=" no-drag xt-active-btn input pointer" style="width:64px;">搜索</div>
        <div class="input flex no-drag pointer" style="width:40px;justify-content:center;align-items:center;">
          <Icon :icon="icons.arrowCounterclockwise20Filled"/>
        </div>
        <div class="flex input"
             style="align-items:center;font-size:14px;color: rgba(255,255,255,0.60);background:none;">共{{ dataNum }}条数据
        </div>
      </div>
      <a-table
        :columns="detailCol"
        :dataSource="detailList.data"
        :scroll="{ x: 1500 }"
        class="table-box" tableLayout='fixed'>
        <a-table-column key="tags" data-index="tags" title="Tags">
          <template #default="{ text: tags }">
          </template>
        </a-table-column>
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
    </div>
  </div>
</template>
<script>
import { Icon } from '@iconify/vue'
import arrowCounterclockwise20Filled from '@iconify-icons/fluent/arrow-counterclockwise-20-filled'
import { goodsStore } from '../../goods/goodsStore'
import { mapActions } from 'pinia'
import { appStore } from '../../../store'

export default {
  name: 'Promotion',
  components: {
    Icon
  },
  computed: {},
  data () {
    return {
      dataNum: 123,
      icons: {
        arrowCounterclockwise20Filled,
      },
      // 搜索
      search: {
        userId: '',
        userType: '',
        keyCode: '',
        promoterId: '',
        higherId: '',
        redemptionTime: '',
        status: '',
        activationTime: '',
      },

      // 滚动条配置
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      // 卡片列表
      cardList: [
        {
          title: '今日推广',
          num: 193,
        },
        {
          title: '今日激活',
          num: 176,
        },
        {
          title: '总推广',
          num: 12984,
        },
        {
          title: '总激活',
          num: 10331,
        },
        {
          title: '激活率',
          num: 98,
        },
      ],

      detailList: {
        // 搜索条件
        time: '',
        state: '',
        data: []

      },
      orderStatus:-1,
      orderStatusOption: [
        {
          label: '全部',
          value: -1
        },{
        label: '已支付',
        value: 0
      }, {
        label: '已成团',
        value: 1
      }, {
        label: '确认收货',
        value: 2
      },
        {
          label: '审核成功',
          value: 3
        }, {
          label: '审核失败',
          value: 4
        },
        {
          label: '已结算',
          value: 5
        },
        {
          label: '已处罚',
          value: 6
        }

      ],
      detailCol: [
        {
          title: '推广用户',
          dataIndex: 'nickname',
          key: 'nickname',
        },
        {
          title: '支付时间',
          dataIndex: 'order_pay_time_str',
          key: 'order_pay_time_str',
        },
        {
          title: '订单号',
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
          title: '店铺',
          dataIndex: 'mall_name',
          key: 'mall_name',
        },
        {
          title: '订单状态',
          dataIndex: 'order_status_desc',
          key: 'order_status_desc',
        },
        {
          title: '推广类型',
          dataIndex: 'type_str',
          key: 'type_str',
        },
        {
          title: '订单金额',
          dataIndex: 'order_amount',
          key: 'order_amount',
        },
        {
          title: '佣金比例',
          dataIndex: 'promotion_rate',
          key: 'promotion_rate',
        },
        {
          title: '预估佣金收入（元）',
          dataIndex: 'promotion_amount',
          key: 'promotion_amount',
        },
        {
          title: '备注',
          dataIndex: 'activationTime',
          key: 'activationTime',
        },
      ]
      // detailCol: [
      //   {
      //     title: '用户',
      //     dataIndex: 'userId',
      //     key: 'userId',
      //   },
      //   {
      //     title: '口令',
      //     dataIndex: 'keyCode',
      //     key: 'keyCode',
      //   },
      //   {
      //     title: '推广员',
      //     dataIndex: 'promoter',
      //     key: 'promoter',
      //   },
      //   {
      //     title: '收益',
      //     dataIndex: 'income',
      //     key: 'income',
      //   },
      //   {
      //     title: '上级推广员',
      //     dataIndex: 'highPromoter',
      //     key: 'highPromoter',
      //   },
      //   {
      //     title: '上级收益',
      //     dataIndex: 'highIncome',
      //     key: 'highIncome',
      //   },
      //   {
      //     title: '兑换时间',
      //     dataIndex: 'redeemTime',
      //     key: 'redeemTime',
      //   },
      //   {
      //     title: '任务进度',
      //     dataIndex: 'taskProgress',
      //     key: 'taskProgress',
      //   },
      //   {
      //     title: '激活',
      //     dataIndex: 'isActive',
      //     key: 'isActive',
      //   },
      //   {
      //     title: '激活时间',
      //     dataIndex: 'activationTime',
      //     key: 'activationTime',
      //   },
      // ]
    }
  },
  mounted () {
    this.refreshData()
  },
  watch: {},
  methods: {
    ...mapActions(goodsStore, ['getOrderList']),
    ...mapActions(appStore, ['showUserCard']),
    async refreshData (page = 1) {
      let rs = await this.getOrderList(page,true)
      if (rs.status) {
        this.detailList.data = rs.data.list
        for (const order of this.detailList.data) {
          order.order_pay_time_str = (new Date((+order.order_pay_time) * 1000)).toLocaleString()
          order.order_amount = order.order_amount / 100
          order.promotion_amount = order.promotion_amount / 100
          order.promotion_rate = (order.promotion_rate / 10) + '%'
          order.type_str = this.convertType(order.type)
        }
        console.log(rs, '获取到的订单情况')
      }
    },
    convertType (type) {
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

  },
}
</script>

<style scoped>
.flex-box {
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 20px;
}

.box-title {
  height: 22px;
  line-height: 22px;
  width: 100%;
  font-size: 16px;
  padding-left: 16px;
  border-left: 4px solid;
  border-color: var(--active-bg);
  margin-top: 24px;
}

.list-box {
  width: 19%;
  min-width: 140px;
  height: 112px;
  background: rgba(0, 0, 0, 0.30);
  border-radius: 4px;
  padding: 16px 20px;
  margin-top: 24px;
  border-left: 4px solid;
  border-color: var(--active-bg);

}

.list-title {
  /* margin-top: 16px; */
  font-size: 14px;
  color: rgba(255, 255, 255, 0.60);
}

.list-num {
  margin-top: 16px;
  font-family: Oswald-Regular;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.85);
}

.search-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.input {
  margin-top: 16px;
  margin-right: 12px;
  background: rgba(0, 0, 0, 0.30);
  border-radius: 10px;
  height: 40px !important;
  font-size: 14px;
}

.table-box {
  width: 100%;
  background-color: none;
  margin-top: 24px;
}

/* atd table */
.table-box :deep(.ant-table-tbody > tr > td) {
  background: #0000009e;
  word-break: break-all;
  white-space: pre-wrap;
}

.table-box :deep(.ant-table-thead > tr > th) {
  background: transparent;
  border-bottom: transparent;
}

.table-box :deep(.ant-table) {
  background: transparent;
}

/* // 滚动条 */
.table-box :deep(.ant-table-content) {
  flex: 1 1 0%;
  overflow: hidden;
  overflow-y: auto;
}

.table-box :deep(.ant-table-content::-webkit-scrollbar) {
  /* width: 2px; */
  height: 5px;
}

.table-box :deep(.ant-table-content::-webkit-scrollbar-thumb) {
  background: #aaa !important;
  border-radius: 3px;
}

</style>
