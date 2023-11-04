
const {
  $,
  ipc,
  args
} = require('../../app.js')
console.log('参数',args)
let interval=setInterval(() => {

  const nickname= $('#ttbar-login .nickname').text()

  let logged = $('#ttbar-login .nickname').length>0 ? !nickname.includes('你好，请登录') : false
  console.log('取到我的订单', logged)
  console.log(args.cbId)
  if(logged){
    ipc.send('api.web.callback',{
      args:{
        cbId:args.cbId,
        data: {
          nickname:nickname
        }
      }
    })
    ipc.send('closeSelf')
    clearInterval(interval)
  }
}, 1000)

