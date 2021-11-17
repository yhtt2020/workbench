const { ipcMain: ipc } = require('electron')
const path = require('path')
const axios = require(path.join(__dirname, '../js/util/axios.js'))
const storage = require('electron-localstorage');

module.exports = {
  initialize: function() {
    //测试接口
    ipc.on('test', async (event, arg) => {
      // const result = await axios.get('/app/testget')
      // console.log(result, '__test!!__')
    })
    //游览器登录
    ipc.on('loginB', async (event, arg) => {
      const data = {
        code: arg
      }
      const result = await axios({
        method: 'post',
        url: '/app/loginB',
        data
      })
      // console.log(result, '__result__')
      event.reply('callback-loginB', result)
    })
    //游览器登出
    ipc.on('logoutB', async(event, arg) => {
      const data = {
        code: arg
      }
      await axios({
        method: 'post',
        url: '/app/logoutB',
        headers: { 'Authorization': storage.getItem(`userToken`)},
        data
      })
      storage.removeItem(`userToken`);
    })
  }
}
