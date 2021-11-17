const { ipcMain: ipc } = require('electron')
const path = require('path')
const axios = require(path.join(__dirname, '../js/util/axios.js'))

module.exports = {
  initialize: function() {
    //游览器登录
    ipc.on('loginB', async (event, arg) => {
      const data = {
        code: arg
      }
      const result = await axios.post('http://test.com:8001/app/loginB', data)
      console.log(result, '__result__')
      event.reply('callback-loginB', result)
    })
    //游览器登出
    ipc.on('logoutB', async(event, arg) => {
      const data = {
        code: arg
      }
      await axios.post('http://test.com:8001/app/logoutB', data)
    })
  }
}


// module.exports = {
//   initialize: function () {
//     ipc.on('loginB', (event, data) => {
//       const { net } = require('electron')
//       const request = net.request('https://www.baidu.com')
//       request.on('response', (response) => {
//         console.log(`STATUS: ${response.statusCode}`)
//         console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
//         response.on('data', (chunk) => {
//           console.log(`BODY: ${chunk}`)
//           event.reply('b-loginB', 'xixi')
//         })
//         response.on('end', () => {
//           console.log('No more data in response.')
//         })
//       })
//       request.end()
//     })
//   },
// }
