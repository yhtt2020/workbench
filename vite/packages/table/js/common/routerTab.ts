import {useRouter, useRoute} from 'vue-router'

const routerTab = {
  /**
   *
   * @param tab 用于检测的tab
   * @param level 路由层级
   * @param variables 路由变量
   */
  isActive(tab,level,variables) {
    const route = useRoute()
    if(route.meta){
      if(variables){
        let matched=String(route.meta['tab'+String(level)]).replace(/\{([^}]+)\}/g, function(match, key) {
          return variables[key.trim()] || match;
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
