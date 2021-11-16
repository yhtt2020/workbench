const { ipcMain: ipc } = require('electron')
const path = require('path')
// const axios = require('./util/axios.js')
const axios = require(path.join(__dirname, '../js/util/axios.js'))

module.exports = {
  initialize: function() {
    ipc.on('loginB', async (event, data) => {
      const result = await axios.get('https://www.baidu.com')
      console.log(result, '__result__')
      event.reply('b-loginB', result)
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
