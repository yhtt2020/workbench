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
  intervalEvent((clear)=>{
    console.log('执行一次采集')
    let expressNo=$('.rax-view-v2 .rax-text-v2.desc').eq(1).text()
    let expressType=$('.rax-text-v2.desc.ellipsis').text()
    let traceNodeEls=$('.rax-view-v2.node-content')
    if(!expressNo){
      return
    }
    clear()
    console.log(expressNo,expressType,traceNodeEls)
    if(traceNodeEls.length===0){
      callback({
        status:0,
        info:'无物流',
      })
      closeSelf()
      return
    }
    let traceNodes=[]
    for(const li of traceNodeEls){
      const $li=$(li)
      let status=$li.find('.title').text()
      let date=$li.find('.date').text()
      let time=$li.find('.rax-text-v2.subtitle').text()
      let txt=$li.find('.rax-view-v2.flexRow.desc').text()
      traceNodes.push({
        date,time,txt,status
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
    console.log(data)
  })

}
