// 电竞资讯小组件接口封装

import { get } from "../js/axios/request"
import { sUrl } from "../consts"


export async function getGameInfo(url){
    let params = {
        apiName:"fapigx.esports.query",
        params:{
            "num":10,
            "page":1,
            "rand":1,
            "apiName":"fapigx.esports.query"
        },
        options:{
        "cache":1,
        "ttl":60,
        "key":"fapigx.esports.query"
        },
    }
    var dataList =[];
    await get(sUrl(url),params).then(res=>{
        for(let i=0;i<res.data.newslist.length&&i<3;i++){
            dataList[i] = res.data.newslist[i]
        }
    })
    return dataList;
}