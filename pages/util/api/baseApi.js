const axios = require("../../../js/util/axios.js");
const { db } = require("../../../js/util/database");
const baseApi = {
  token: "",
  currentUser: {},
  uid: 0,
  getCurrentUser: () => {
    return db.system.where("name").equals("currentUser").first();
  },
  init: async () => {
    await baseApi.getCurrentUser().then((user) => {
      baseApi.currentUser = user;
      baseApi.token = user.value.token;
      baseApi.uid = user.value.uid;
    });
  },

  /**
   *
   * @param {String} url 请求url
   * @param {Object} params  请求体body或query对象
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
