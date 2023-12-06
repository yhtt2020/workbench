// 电竞资讯小组件接口封装

import { get } from "../js/axios/request"
import { sUrl } from "../consts"
import axios from "axios";


export async function getGameInfo(url){
    let params = {
        apiName:"fapigx.esports.query",
        params:JSON.stringify({
            "num":10,
            "page":1,
            "rand":1,
            "apiName":"fapigx.esports.query"
        }),
        options:JSON.stringify({
            "cache":1,
            "ttl":60,
            "key":"fapigx.esports.query"
            }),
        }
    let dataList =[];
    // let res = null
    // let serverCacheTtl=60*10
    // //强制刷新，直接获取并设置服务器缓存
    // let axiosResponse = await axios.get(sUrl(url),params)
    // console.log('axiosResponse',axiosResponse);
    // if (axiosResponse.status === 200) {
    //     // 如果请求到数据，post到serverCache的setCache api
    //     await serverCache.set(url, axiosResponse,serverCacheTtl).then()
    // }
    // res=axiosResponse
    await get(sUrl(url),params).then(res=>{
        if(res?.status){
            if (res.data.allnum) {
                dataList = res.data.newslist
            }
        }
    })
    return dataList;
}