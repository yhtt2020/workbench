import {message} from "ant-design-vue";
import {courierStore} from "../../../../apps/ecommerce/courier";

const appDirName = window.globalArgs['app-dir_name']
const grab = {
  tb: {
    login(callback) {
      tsbApi.web.openPreloadWindow({
        width: 1200,
        height: 800,
        background: false,
        url: 'https://login.taobao.com/member/login.jhtml',
        preload: appDirName + '/../appPreload/ecommerce/tb/login.js',
        callback: (data) => {
          console.log('登录成功了，接下来进行下一步')
          callback(data)
        }
      })
    },
    getOrder(callback, page = 1) {
      const url = 'https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm'
      tsbApi.web.openPreloadWindow({
        background: true,
        url: url,
        preload: appDirName + '/../appPreload/ecommerce/tb/order.js',
        callback: (data) => {
          callback(data)
        }
      })
    },
    getOrderDetail(url, callback) {
      tsbApi.web.openPreloadWindow({
        background: true,
        url: url,
        preload: appDirName + '/../appPreload/ecommerce/tb/detail.js',
        callback: (data) => {
          console.log('获取到淘宝详情')
          callback(data)
        }
      })
    }
  },
  jd: {
    login(callback) {
      tsbApi.web.openPreloadWindow({
        width: 1200,
        height: 800,
        background: false,
        url: 'https://passport.jd.com/uc/login',
        preload: appDirName + '/../appPreload/ecommerce/jd/login.js',
        callback: (data) => {
          console.log('登录成功了，接下来进行下一步')
          callback(data)
        }
      })
    },
    getOrder(callback, page = 1) {
      tsbApi.web.openPreloadWindow({
        background: false,
        url: 'https://order.jd.com/center/list.action' + '?page=' + page,
        preload: appDirName + '/../appPreload/ecommerce/jd/order.js',
        callback: (data) => {
          callback(data)
        }
      })
    },
    getOrderDetail(url, callback) {
      tsbApi.web.openPreloadWindow({
        background: true,
        url: url,
        preload: appDirName + '/../appPreload/ecommerce/jd/detail.js',
        callback: (data) => {
          console.log('获取到京东详情')
          callback(data)
        }
      })
    }
  }
}

export default grab
