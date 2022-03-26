const axios = require("../../../js/util/axios.js");
const { db } = require("../../../js/util/database");
const baseApi = {
  token: "",
  currentUser: {},
  uid: 0,
  refreshToken: '',
  expire_deadtime: 0,
  refreshExpire_deadtime: 0,
  getCurrentUser: () => {
    return db.system.where("name").equals("currentUser").first();
  },
  init: async (user=false) => {
    if(user===false){
      userData=await baseApi.getCurrentUser()
      if(userData){
        user=userData.value
      }
    }
      baseApi.currentUser = {value:user};
      baseApi.token = user.token;
      baseApi.uid = user.uid;
      baseApi.refreshToken = user.refreshToken
      baseApi.expire_deadtime = user.expire_deadtime
      baseApi.refreshExpire_deadtime = user.refreshExpire_deadtime
  },

  /**
   *
   * @param {String} url 请求url
   * @param {Object} params  请求体body或query对象, body中请传入类似data:{...}的格式，query中请传入{...}的格式。
   * @param {String} method  请求方式默认为post
   * @returns Promise
   */
  axios: async (url, params, method = "post") => {
    let data = {};
    if (method === "get") data = { params };
    if (method === "post" || method === "put" || method === "delete")
      data = { data: params };
    //todo cache请求缓存后期做一下，防止在1000毫秒内重复请求设置
    return axios({
      method: method,
      url: url,
      headers: { Authorization: baseApi.token },
      ...data,
      expireInfo: {
        token: baseApi.token,
        refreshToken: baseApi.refreshToken,
        expire_deadtime: baseApi.expire_deadtime,
        refreshExpire_deadtime: baseApi.refreshExpire_deadtime,
        inMain: false
      }
    });
  },
};
module.exports = baseApi;
