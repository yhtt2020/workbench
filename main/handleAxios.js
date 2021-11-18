const { ipcMain: ipc } = require('electron')
const path = require('path')
const axios = require(path.join(__dirname, '../js/util/axios.js'))
const storage = require('electron-localstorage');

module.exports = {
  initialize: function() {
    // let baseURL
    // //设置默认baseURL
    // ipc.on('setBaseUrl', (event, arg) => {
    //   baseURL = arg
    // })
    //游览器登录
    ipc.on('loginBrowser', async (event, arg) => {
      const data = {
        code: arg
      }
      const result = await axios({
        method: 'post',
        url: `/app/loginBrowser`,
        data
      })
      console.log(result, '__res__')
      if(result.code === 1000) {
        storage.setItem(`userToken`, result.data.token)
      }
      event.reply('callback-loginBrowser', result)
    })
    //游览器登出
    ipc.on('logoutBrowser', async(event, arg) => {
      const data = {
        code: arg
      }
      await axios({
        method: 'post',
        url: `/app/logoutBrowser`,
        headers: { 'Authorization': storage.getItem(`userToken`)},
        data
      })
      storage.removeItem(`userToken`);
    })
  }
}
