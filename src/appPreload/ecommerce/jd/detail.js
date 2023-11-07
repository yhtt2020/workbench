const {
  $,
  intervalEvent,
  callback,
  closeSelf
} = require('../../app')

intervalEvent((clear)=>{

  if($('#ttbar-login .nickname').length>0){

    const nickname= $('#ttbar-login .nickname').text()
    console.log('获得昵称',nickname)
    if(!nickname) return
    if(nickname.includes('你好，请登录')){
      clear()
      callback({
        status:0,
        info:'账号过期',
        code:401
      })
    }else{
      clear()
      main()
      //main()
    }
  }



})

function main(){
  console.log('正式启动采集')
  let expressNo=$('.J-delivery-track li').eq(2).text()
  let expressType=$('.J-delivery-track li').eq(1).text()
  let traceNodeEls=$('.track-list li')
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
  console.log(data)
}
