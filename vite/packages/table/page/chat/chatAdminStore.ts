import {defineStore} from "pinia";
import {sUrl} from "../../consts";
import {get} from "../../js/axios/request";

export const chatAdminStore = defineStore('chatAdminStore', {
  state: () => ({
    stats:{},
  }),
  actions: {
    /**
     * 刷新统计数据
     */
    async refreshStats() {
      let statsResponse = await get(sUrl('/app/chat/admin/stats'))
      console.log(statsResponse,'顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶')
      if(statsResponse.status){
        this.stats=statsResponse.data[0]
        console.log(this.stats,'统计数据，当天')
      }else{
        this.stats={}
      }
    },
  }

})
