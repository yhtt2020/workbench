import {message, notification} from "ant-design-vue";
import grab from "./grab";
import _ from 'lodash-es'
import {courierStore} from "../../../apps/ecommerce/courier";

const ui={
  async refreshAll (tip=true) {

    const store=courierStore()
    store.settings.lastRefreshTime=Date.now()
    // 快递鸟快递信息更新
    await store.refreshCouriers()
    tip && message.loading({
      content: '正在为您更新京东商城订单',
      key: 'loadingTip',
      duration: 0
    })
    if (store.storeInfo.jd.nickname) {
      //京东绑定了
      grab.jd.getOrder(async (args) => {
        if (args.status) {
          tip &&  message.loading({
            content: '订单获取成功，正在为您更新订单详情',
            key: 'loadingTip',
            duration: 0
          })
          await ui.getOrderDetail(args.data.orders)
          let count = await store.saveJdOrders(args.data)
          tip &&  message.success({ content: '成功更新' + count + '个京东订单信息', key: 'loadingTip' })
          await store.getDbCourier()
          console.log('刷新一下本地记录')
        } else {
          notification.info({
            message: '京东账号已过期，点击重新绑定后再刷新。',
            onClick: () => {
              grab.jd.login((args) => {
                store.storeInfo.jd.nickname = args.data.nickname
                message.success({
                  content: '京东重新登录成功。请重新刷新。',
                  key: 'loadingTip',
                  duration: 0
                })
              })
            }
          })
        }

      })
    }
    if (store.storeInfo.tb.nickname) {
      grab.tb.getOrder((args) => {
        if (args.status === 0 && args.code === 401) {
          notification.info({
            message: '淘宝账号已过期，点击重新绑定。',
            onClick: () => {
              grab.tb.login((args) => {

                console.log(args, '获取到的订单信息')
              })
            }
          })
        }
      })
      //淘宝绑定了
    }
    //todo 刷新其他订单
  },

  async getOrderDetail (orders,tip=true) {
    const store=courierStore()
    let completed=0
    let promises = []
    for (const order of orders) {
      if ((order.status === '商品出库' || order.latestNodes.length===0)&& order.status !== '订单取消') {
        //只检查等待收货的商品
        //仅检查未完成的订单
        let getProcess = new Promise((resolve, reject) => {
          grab.jd.getOrderDetail(order.detailUrl, ({ status, code, data }) => {
            if (status) {
              completed++
              order.detail = {}
              order.detail.expressNo = data.expressNo
              order.detail.traceNodes = data.traceNodes
              order.detail.expressType = data.expressType
              order.detail.updateTime = Date.now()

              resolve(data)
            } else {
              completed++
              reject({
                status, code
              })
            }

          })
        })
        promises.push(getProcess)
      }
    }
    tip && message.loading({
      content: '共有' + promises.length + '个订单需要更新物流信息，' + '请稍候…',
      key: 'loadingTip',
      duration: 0
    })

    console.log('要执行的promises=',promises)
    let taskChunks=_.chunk(promises,5)
    for(const chunk of taskChunks){
      //切片并发5个
      await Promise.allSettled(chunk)
      console.log('执行完成一个块',chunk)
    }

    tip &&  message.success({
      content: '订单物流信息更新完成。',
      key: 'loadingTip',
      duration: 4
    })
    console.log('更新后的订单', store.storeInfo.jd.order)
  },
}

export default ui
