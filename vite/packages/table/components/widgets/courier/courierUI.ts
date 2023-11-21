import {message, notification} from "ant-design-vue";
import grab from "./grab";
import _ from 'lodash-es'
import {courierStore} from "../../../apps/ecommerce/courier";
import {getOrderState} from "./courierTool";

const ui = {
  /**
   * 刷新全部的订单
   * @param tip 是否有文字提示
   */
  async refreshAll(tip = true) {
    const store = courierStore()
    store.settings.lastRefreshTime = Date.now()
    // 快递鸟快递信息更新
    store.refreshCouriers()
    if (store.storeInfo.jd.nickname) {
      tip && message.loading({
        content: '正在为您更新京东商城订单',
        key: 'loadingTip',
        duration: 0
      })
      //京东绑定了
      grab.jd.getOrder(async (args) => {
        if (args.status) {
          tip && message.loading({
            content: '订单获取成功，正在为您更新订单详情',
            key: 'loadingTip',
            duration: 0
          })
          await ui.getJdOrderDetail(args.data.orders)
          let count = await store.saveJdOrders(args.data)
          tip && message.success({content: '成功更新' + count + '个京东订单信息', key: 'loadingTip'})
          await store.getDbCourier()
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
     ui.getTbOrders(()=>{

     })
      //淘宝绑定了
    }
    //todo 刷新其他订单
  },

  /**
   * 获取京东的订单详情并存入数据库
   * @param orders
   * @param tip
   */
  async getJdOrderDetail(orders, tip = true) {
    const store = courierStore()
    let completed = 0
    let promises = []
    for (const order of orders) {
      if ((order.status === '商品出库' || order.latestNodes.length === 0) && order.status !== '订单取消') {
        //只检查等待收货的商品
        //仅检查未完成的订单
        let getProcess = new Promise((resolve, reject) => {
          grab.jd.getOrderDetail(order.detailUrl, ({status, code, data}) => {
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
    let taskChunks = _.chunk(promises, 5)
    for (const chunk of taskChunks) {
      //切片并发5个
      await Promise.allSettled(chunk)
    }

    tip && message.success({
      content: '订单物流信息更新完成。',
      key: 'loadingTip',
      duration: 4
    })
  },
  /**
   * 绑定淘宝
   */
  bindTb(callback, tip = true) {
    grab.tb.login((args) => {
      const store = courierStore()
      store.storeInfo.tb.nickname = args.data.nickname;
      callback && callback()
      tip && message.loading({
        content: "已成功绑定淘宝账号：" + args.data.nickname + "，正在为您获取订单信息，请稍候…",
        key: "loadingTip",
        duration: 0,
      });
      ui.getTbOrders(() => {

      })
    });
  },
  /**
   * 获取淘宝的订单详情
   * @param callback
   * @param tip
   */
  getTbOrders(callback, tip = true) {
    const store = courierStore()
    tip && message.loading({
      content: "已绑定淘宝账号：" + store.storeInfo.tb.nickname + "，正在为您更新订单信息，请稍候…",
      key: "loadingTip",
      duration: 0,
    });
    grab.tb.getOrder(async (args) => {
      console.log('淘宝返回原始数据', args)
      if (args.status === 0) {
        //如果返回没有成功
        if (args.code === 401) {
          tip && message.error("获取订单失败，检测到登录信息过期，请重新登录。");
          store.storeInfo.tb.nickname = null;
          return callback({
            status: 0,
            code: 401,
            info: '登录信息过期'
          })
        } else {
          tip && message.error("获取订单意外失败。");
          return;
        }
      }
      tip && message.success({
        content: "更新订单成功!本次共更新：" + args.orders.length + "条订单信息",
        key: "loadingTip",
        duration: 3,
      });
      await store.saveTbOrders(args.orders)
      await store.getDbCourier()
      await ui.getTbOrderDetail(args.orders)

    });
  },
  /**
   * 获取淘宝订单详情
   * @param orders
   * @param tip
   */
  async getTbOrderDetail(orders, tip = true) {

  },
  /**
   * 根据订单的状态、平台筛选订单，默认以全部订单，可提交初次筛选后的列表
   * @param state
   * @param platform
   * @param orderList
   */
  filterOrder(state = 'all', platform = 'all', orderList = null) {
    let list = orderList
    const store = courierStore()
    if (!list) {
      list = store.orderList
    }
    let filtered = list.filter(li1 => {
      //平台筛选
      if (platform === 'all') {
        return true
      }
      if (platform === 'common') {
        return !li1.store
      }
      return li1.store === platform
    }).filter(li2 => {
      if (state === 'all') {
        return true
      }
      return getOrderState(li2) === state
    })
    return filtered
  }
}

export default ui
