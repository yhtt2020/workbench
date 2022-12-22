import axios from 'axios'

const service = axios.create({
  baseURL: '//wad.apps.vip/api',  //请求的地址
  timeout: 5000,  //访问超时的时间

});

export default service;
