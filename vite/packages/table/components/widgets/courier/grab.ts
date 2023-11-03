import {message} from "ant-design-vue";
import {courierStore} from "../../../store/courier";

const grab={
  jd:{
    login(callback){
      tsbApi.web.openPreloadWindow({
        width: 1200,
        height: 800,
        background: false,
        url: 'https://passport.jd.com/uc/login',
        preload: window.globalArgs['app-dir_name'] + '/../appPreload/ecommerce/jd/login.js',
        callback: (data) => {
          console.log('登录成功了，接下来进行下一步')
          callback(data)
        }
      })
    },
    getOrder(callback,page=1){
      tsbApi.web.openPreloadWindow({
        background: true,
        url: 'https://order.jd.com/center/list.action'+'?page='+page,
        preload: window.globalArgs['app-dir_name'] + '/../appPreload/ecommerce/jd/order.js',
        callback: (data) => {
          callback(data)
        }
      })
    },
  }
}

export default grab
