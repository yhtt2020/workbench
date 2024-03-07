import {useEnv} from "../../ui/hooks/useEnv"
import { getCurrentInstance } from 'vue';
import cache from "../../components/card/hooks/cache";
import { appStore } from '../../store'
// 全局导入

export const getConfig = async () => {
  let res
  let token  = cache.get('ttUserToken')



  return {
    headers: {
      'Authorization': token
    }
  }
}
