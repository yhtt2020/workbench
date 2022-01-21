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
  init: async () => {
    await baseApi.getCurrentUser().then((user) => {
      baseApi.currentUser = user;
      baseApi.token = user.value.token;
      baseApi.uid = user.value.uid;
      baseApi.refreshToken = user.value.refreshToken
      baseApi.expire_deadtime = user.value.expire_deadtime
      baseApi.refreshExpire_deadtime = user.value.refreshExpire_deadtime
    });
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
        refreshToken: baseApi.refreshToken,
        expire_deadtime: baseApi.expire_deadtime,
        refreshExpire_deadtime: baseApi.refreshExpire_deadtime,
        inMain: false
      }
    });
  },
};
module.exports = baseApi;
