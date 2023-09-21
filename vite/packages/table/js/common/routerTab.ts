import {useRouter, useRoute} from 'vue-router'

const routerTab = {
  isActive(tab,level,variables) {
    const route = useRoute()
    console.error(route,'当前的route')
    if(route.meta){
      if(variables){
        let matched=String(route.meta['tab'+String(level)]).replace(/\{([^}]+)\}/g, function(match, key) {
          return variables[key.trim()] || match;
        })
        console.error(matched,'匹配之后',tab,'tab=')
        return matched === tab
      }
     else {
       console.error(String(route.meta['tab'+String(level)]),tab)
       return String(route.meta['tab'+String(level)])===tab
      }
    }

  }
}


export default routerTab
