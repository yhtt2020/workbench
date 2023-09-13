import {defineStore} from "pinia";
import {sUrl} from "../../consts";
import {get} from "../../js/axios/request";

export const chatAdminStore = defineStore('chatAdminStore', {
  state: () => ({
    stats:{},
    communityData:{
      communityModal:null,
    },
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

    /***
     * 获取社群数据进行是否加入判断
     * 
    */
    async getCommunityData (id:any) {
      // const options  = {
      //   groupID:id,
      // };
      // (window as any).$chat.getGroupProfile(options).then((res:any)=>{
      //   this.communityData.communityModal = false
      //   console.log('获取结果',res);
      // }).catch((error:any)=>{
      //   this.communityData.communityModal = true
      //   return error
      // })
      // const groupMember = await chat.getGroupMemberList({groupID:id})
      // Promise.all([groupRes,groupMember]).then(res=>{
      //   console.log('返回结果::>>',res);
        
      // })
    },
  }

})
