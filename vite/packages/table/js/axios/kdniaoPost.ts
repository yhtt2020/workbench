
import axios from "axios";
import {getConfig} from "./serverApi";
export async function post(url, data, options = {crud: false}) {
    let conf = await getConfig()
    if (options.crud) {
      conf.headers['Content-Type'] = 'application/json'
    }
    let result
    if(options.crud){
       result = await axios.post(url, JSON.stringify(data), conf
      )
    }else{
       result = await axios.post(url, {
          ...data
        }, conf
      )
    }
    if ( result.status == 200) {
      return result.data.data
    } else {
      console.error('接口返回意外错误',result)
      return null
    }
  }