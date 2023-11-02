console.log('登录成功')
const {
  $,
  ipc,
  args
} = require('../../app.js')
console.log('参数',args)
let interval=setInterval(() => {

  const nickname= $('#ttbar-login')[0].innerText
  let logged = $('#ttbar-login').length > 0 ? !nickname.includes('你好，请登录') : false
  console.log('取到我的订单', logged)
  console.log(args.cbId)
  if(logged){
    ipc.send('api.web.callback',{
      args:{
        cbId:args.cbId,
        data: {
          nickname:nickname.substring(0,nickname.indexOf('\n'))
        }
      }
    })
    ipc.send('closeSelf')
    clearInterval(interval)
  }
}, 1000)

