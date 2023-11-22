const {
  $,
  intervalEvent,
  callback,
  closeSelf
} = require('../../app')
setTimeout(()=>{
  callback({
    status:0,
    code:500,
    info:'超时失败'
  })
},10000)
intervalEvent((clear)=>{
  const nickname = $('.site-nav-user a').text()
  if (nickname) {
    clear()
    main()
  } else {
    if (window.location.href.includes('login')) {
      callback({
        status: 0,
        info: '淘宝掉登录',
        code: 401
      })
      clear()
      closeSelf()
    }
  }
})

function main(){
  console.log('正式启动采集')
  let expressNo=$('.J-delivery-track li').eq(2).text()
  let expressType=$('.J-delivery-track li').eq(1).text()
  let traceNodeEls=$('.track-list li')
  if(traceNodeEls.length===0){
    callback({
      status:0,
      info:'无物流',
    })
    //closeSelf()
    return
  }
  let traceNodes=[]
  for(const li of traceNodeEls){
    const $li=$(li)
    let date=$li.find('.date').text()
    let time=$li.find('.time').text()
    let txt=$li.find('.txt').text()
    traceNodes.push({
      date,time,txt
    })
  }
  const data={}
  data.expressNo=expressNo
  data.expressType=expressType
  data.traceNodes=traceNodes
  callback({
    status:1,
    info:'获取物流信息成功',
    data
  })
  closeSelf()
  //closeSelf()
  console.log(data)
}
