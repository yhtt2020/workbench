import {useRouter, useRoute} from 'vue-router'

const routerTab = {
  /**
   *
   * @param tab 用于检测的tab
   * @param level 路由层级
   * @param params 路由变量
   */
  isActive(tab,level,params) {
    const route = useRoute()
    if(route.meta){
      if(params){
        let matched=String(route.meta['tab'+String(level)]).replace(/\{([^}]+)\}/g, function(match, key) {
          return params[key.trim()] || match;
        })
        return matched === tab
      }
     else {
       return String(route.meta['tab'+String(level)])===tab
      }
    }
  }
}


export default routerTab
