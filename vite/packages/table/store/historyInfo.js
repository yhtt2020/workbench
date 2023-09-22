// 历史上的今天小组件接口封装

import { get } from "../js/axios/request"
import { sUrl } from "../consts"
import cache from "../components/card/hooks/cache"


export async function getHistoryInfo(url){
    let now = new Date;
    let date = now.getMonth() +1  + '/' + now.getDate()
    let params = { 
        apiName:"todayOnhistory.queryEvent|php",
        params:{
            date:date.toString()
        },
        options:{"cache":1,"ttl":60,"key":"todayOnhistory.queryEvent"}
    }
    let getData = ""
    await get(sUrl("/app/juhe/get"),params).then(res=>{
        getData = res.data[0]
    })
    return getData;
}