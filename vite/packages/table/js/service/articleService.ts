import {post} from '../axios/request'
import {sUrl} from '../../consts'
export default {
  async getOne(name) {
    let response = await post(sUrl('/app/article/getOne'), {
      name: name
    })
    if (response.status) {
      return response.data
    }else{
      return {
        title:'',
        content:''
      }
    }
  },
  async getMany(names) {
    let response = await post(sUrl('/app/article/getMany'), {
      names: names
    })
    
    if (response.status) {
      return response.data
    }
  }
}
