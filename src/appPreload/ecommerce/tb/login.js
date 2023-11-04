const {
  $,
  ipc,
  args
} = require('../../app.js')
console.log('参数',args)
let interval=setInterval(() => {

  const nickname= $('.site-nav-user a').text()
  let logged =  !!nickname
  if(logged){
    console.log('找到昵称',nickname)
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
