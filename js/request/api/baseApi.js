const axios = require("../../util/axios.js");
const storage = require('electron-localstorage');
const { db } = require("../../util/database.js");

const baseApi = {
  inMain: false,
  token: "",
  currentUser: {},
  uid: 0,
  beforeInit: async() => {
    db.open().catch(function (e) {
      baseApi.inMain = true
    });
  },
  getCurrentUser: () => {
    return db.system.where("name").equals("currentUser").first();
  },
  init: async () => {
    await baseApi.beforeInit()
    if(baseApi.inMain) {
      const userToken = storage.getItem(`userToken`)
      const userInfo = storage.getItem(`userInfo`)
      baseApi.currentUser = userInfo;
      baseApi.token = userToken;
      baseApi.uid = userInfo.uid;
    } else {
      const user = await baseApi.getCurrentUser()
      if(user.value.uid === 0) {
        return Promise.reject('请先登入再操作!')
      } else {
        baseApi.currentUser = user;
        baseApi.token = user.value.token;
        baseApi.uid = user.value.uid;
      }
    }
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
    });
  },
};
module.exports = baseApi;
