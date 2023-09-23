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
    // setInterval
    let getData = ""
    let cacheData = cache.get("historyInfoData")

    // 缓存超时或被清除 重新缓存
    var d = new Date()
    var ts = 86400
    var date1 = new Date(((parseInt(d.getTime() / 1000 / ts) * ts) + (d.getTimezoneOffset() * 60))*1000).getTime()
    
    // 缓存需要写进去的时间 今日剩余的时间戳
    let date2 = ts * 1000 - ( new Date().getTime() - date1);
    console.log("date2",date2)

    // setTimeout(getHistoryInfo(url),10000)

    if (!cacheData) {
        cacheData = ""
        await get(sUrl("/app/juhe/get"),params).then(res=>{
            cacheData = res.data[0]
            // 设定时间后缓存超时
            cache.set("historyInfoData",cacheData, date2)
            getData = cacheData
        })
        // 定时器

        // setTimeout
        setTimeout(()=>{
            // 需要重新进行加载
        },date2)
    }else{
        // 走已有的缓存
        getData = cacheData;
    }
    return getData;
}