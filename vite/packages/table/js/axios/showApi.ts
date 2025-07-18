//万维易源api

import {sUrl} from "../../consts";
import axios from "axios";
import {apiPost} from "./request";


const showApi = {
  url: sUrl("/app/showApi"),
  showapiUrl: "https://route.showapi.com/",
  async getAccessToken() {
    let lsItem = localStorage.getItem("showApiAccessToken");
    if (lsItem) {
      try {
        let token: {
          "out_code": string, //此token绑定的外部渠道编码（为了便于和外部渠道用户对应）。
          "appid": number,//创建此token的appid
          "rate": number,//可调用并发值。
          "end_time": string,
          "expires_in": number,//过期时间，秒。
          "ip_white_list": string,//此token的访问ip白名单。空串表示不设置。
          "access_token": string,//客户端访问token。客户端不再需要使用appid和secret进行鉴权，在get或post请求中带上access_token=xxx即可完成鉴权。
          "remark": string,
          "permission_list": string
        } = JSON.parse(lsItem);
        console.log('已经存在access_token')
        token = JSON.parse(lsItem)
        if (new Date(token.end_time).getTime() > new Date().getTime()) {
          return {
            status: 1,
            data: token.access_token
          }
        }
      } catch (e) {
        console.error('token解析失败，重新发起请求')
      }
    }
    let rs = await apiPost('/app/showapi/get_access_token');
    if (rs.status) {
      console.log('请求', rs.data)
      localStorage.setItem("showApiAccessToken", JSON.stringify(rs.data.item));
      return {
        status: 1,
        data: rs.data.item.access_token
      }
    }

  },
  async api(apiName = '', params = {}) {
    let access_token_rs = await showApi.getAccessToken()
    if(!access_token_rs.status){
      return {
        status: 0,
        info:'无法获得有效access_token'
      }
    }
    let result:any = await axios.post(showApi.showapiUrl + apiName +"?access_token="+access_token_rs.data, params,{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    console.log(result, 'api结果')
    /**
     * {
     *     "showapi_res_error": "",
     *     "showapi_res_id": "6878ec37fb638c9c73344a8c",
     *     "showapi_res_code": 0,
     *     "showapi_fee_num": 1,
     *     "showapi_res_body": {
     *         "rate": "1.156759",
     *         "money": "11.5676",
     *         "ret_code": 0
     *     }
     * }
     */

    if(result?.data?.showapi_res_code==0){
      return {
        status: 1,
        data: result?.data?.showapi_res_body
      }
    }else{
      return {
        status:0,
        info:'接口返回失败'
      }
    }


  },
  //获取新闻频道
  async getNewsChannel() {
    let rs = await showApi.api('109-34')
    if(rs.status){
      return rs.data.channelList
    }
  },
  async getNewsList(channelId){
    let rs = await showApi.api('109-35',{
      channelId:channelId
    })
    if(rs.status){
      return {
        status:1,
        data:rs.data.pagebean
      }
    }else{
      return {
        status:0,
        info:'获取新闻列表失败'
      }
    }
  }

}

export default showApi;

export const getExchangeRate = async ({fromCode,toCode,money}) => {
  const res = await showApi.api('105-31',{
    fromCode,
    toCode,
    money
  })
  return res
}