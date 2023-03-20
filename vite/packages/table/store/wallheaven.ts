import { defineStore } from "pinia";
import axios from 'axios'
export const wallStore = defineStore('wall',{
   state:()=>({
      wallPaperList:[]
   }),
   actions:{
      /**
       * 将搜索条件进行数据获取
       * @param searchObj
       * **/
      getWallPaperSearch(searchObj){
        let searchUrl = `https://wallhaven.cc/api/v1/search?&categories=${searchObj.categories}&purity=${searchObj.purity=='SFW' ? '100':'101' }&sorting=${searchObj.sorting}${searchObj.atleast === ''? '':`&atleast=${searchObj.atleast}`}${searchObj.q !='' ? `&q=${searchObj.q}`:''}`
        console.log(searchUrl);
        
        // axios.get(searchUrl).then((res)=>{
        //    console.log(res);
        // })
      }
   }
})