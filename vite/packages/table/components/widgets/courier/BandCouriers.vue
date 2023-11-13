<template>
  <div>
    <div class="flex ">
      <xt-button class="mr-2 commerce-large" @click="bindJd" v-if="storeInfo.jd.nickname === null"
                 style="width: 40px; height: 40px;background: #E12419;font-weight: 600;color: rgba(255,255,255,0.85) !important;font-size: 24px;">
        JD
      </xt-button>
      <xt-button class="mr-2 commerce-large" @click="bindTb" v-if="storeInfo.tb.nickname === null"
                 style="width: 40px; height: 40px;background: #FA5000;font-weight: 600;color: rgba(255,255,255,0.85) !important;font-size: 24px;">
        淘
      </xt-button>
      <xt-button :w="129" :h="40" style="background: #508BFE;color: rgba(255,255,255,0.85) !important;"
                 @click="addCourier">
        <newIcon icon="fluent:add-16-filled" style="font-size: 20px;line-height: 40px;vertical-align: sub;"/>
        自定义添加
      </xt-button>
    </div>

  </div>
  <AddCourierModal ref="addCourierRef"/>
  <DealModal ref="dealModalRef" :type="dealType"/>
</template>
<script>
import { courierStore } from '../../../store/courier.ts'
import { mapWritableState, mapActions } from 'pinia'
import AddCourierModal from './courierModal/AddCourierModal.vue'
import grab from './grab'
import { Icon as newIcon } from '@iconify/vue'
import { message, Modal } from 'ant-design-vue'
import DealModal from './courierModal/DealModal.vue'

export default {
  name: 'band',
  components: {
    AddCourierModal,
    newIcon,
    DealModal
  },
  data () {
    return {
      dealType: ''
    }
  },
  methods: {
    bindJd () {
      if (!this.storeInfo.jd.nickname) {
        this.dealType = 'jd'
        this.$refs.dealModalRef.openDealDetail()
      } else {
        message.loading({
          content: '已绑定账号：' + this.storeInfo.jd.nickname + '，正在为您更新订单信息，请稍候…',
          key: 'loadingTip',
          duration: 0,
        })
        grab.jd.getOrder(async ({ data }) => {
          message.success({
            content: '更新订单成功!本次共更新：' + data.orders.length + '条订单信息',
            key: 'loadingTip',
            duration: 3,
          })
          this.storeInfo.jd.order = data
          await this.getOrderDetail(data.orders)
          console.log(data)
        })
      }
    },

    // 关联淘宝
    bindTb () {
      if (!this.storeInfo.tb.nickname) {
        this.dealType = 'tb'
        this.$refs.dealModalRef.openDealDetail()
      } else {
        message.loading({
          content: '已绑定淘宝账号：' + this.storeInfo.tb.nickname + '，正在为您更新订单信息，请稍候…',
          key: 'loadingTip',
          duration: 0,
        })
        grab.tb.getOrder((args) => {
          if (args.status === 0) {
            if (args.code === 401) {
              message.error('获取订单失败，检测到登录信息过期，请重新登录。')
              this.storeInfo.tb.nickname = null
              this.bindTb()
              return
            }
            message.error('获取订单意外失败。')
            return
          }
          message.success({
            content: '更新订单成功!本次共更新：' + args.data.orders.length + '条订单信息',
            key: 'loadingTip',
            duration: 3,
          })
          this.getOrderDetail(data.orders)
          console.log(args)
        })
      }
    },
    async getOrderDetail (orders) {

      let promises = []
      for (const order of orders) {

        if (order.status === '商品出库') {
          //只检查等待收货的商品
          //仅检查未完成的订单
          let getProcess = new Promise((resolve, reject) => {
            grab.jd.getOrderDetail(order.detailUrl, ({ status, code, data }) => {
              if (status) {
                console.log('成功获得订单详情', data)
                order.detail = {}
                order.detail.expressNo = data.expressNo
                order.detail.traceNodes = data.traceNodes
                order.detail.expressType = data.expressType
                order.detail.updateTime = Date.now()
                resolve(data)
              } else {
                reject({
                  status, code
                })
              }

            })
          })
          promises.push(getProcess)
        }
      }
      message.loading({
        content: '共有' + promises.length + '个订单需要更新物流信息，' + '请稍候…',
        key: 'loadingTip',
        duration: 0
      })

      await Promise.all(promises)
      message.success({
        content: '订单物流信息更新完成。',
        key: 'loadingTip',
        duration: 4
      })
      console.log('更新后的订单', this.storeInfo.jd.order)
    },
    addCourier () {
      this.$refs.addCourierRef.openCourierModel()
    }
  },
  computed: {
    ...mapWritableState(courierStore, ['storeInfo'])
  }
}
</script>
<style lang="scss" scoped></style>
