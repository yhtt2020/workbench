const {
  $,
  ipc,
  args,
  intervalEvent
} = require('../../app.js')
const { isLogged, getNickname } = require('./util')
intervalEvent((clear) => {
  let logged = isLogged()
  console.log('取到我的订单', logged)
  console.log(args.cbId)
  if (logged) {
    ipc.send('api.web.callback', {
      args: {
        cbId: args.cbId,
        data: {
          nickname: getNickname()
        }
      }
    })
    ipc.send('closeSelf')
    clear()
  }
}, 1000)





