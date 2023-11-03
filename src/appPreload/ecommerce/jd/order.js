const {
  $,
  ipc,
  args
} = require('../../app.js')

function clearText (text) {
  return text.replaceAll('\n', '').replaceAll(' ', '').replaceAll('\t', '')
}

function fixProtocol (url) {
  return window.location.protocol + url
}

function getOrderInfo ($item) {
  const order = {
    id: '',
    dealtime: '',
    items: [],
    detailUrl: '',
    arrivalAt: '',//预计到达
    latestNodes: [],//订单最新节点,
    expressType: '',//物流类型
    expressNo: '',//订单号
    parentOrderId: '',

    status: '',
  }
  if ($item.get(0).classList.length > 1) {
    const dom = $item.get(0)
    dom.classList.forEach(cls => {
      if (cls.startsWith('parent-')) {
        order.parentOrderId = cls.replaceAll('parent-', '')
      }
    })
  }
  order.id = $item.find('a[name=\'orderIdLinks\']').text()
  order.dealtime = $item.find('.dealtime').text()

  const children = $item.children('.tr-bd')
  for (const child of children) {
    const item = {
      cover: '',
      name: '',
      num: 1,
      consignee: '',
      amount: '',
      detailUrl: ''
    }
    if ($(child).hasClass('sep-tr-bd')) continue
    item.cover = fixProtocol($(child).find('.goods-item img').attr('src'))
    item.name = $(child).find('.p-msg .p-name a').attr('title')
    item.num = clearText($(child).find('.goods-number').text())
    item.consignee = $(child).find('.consignee .txt').text()
    item.amount = clearText($(child).find('.amount').text())

    order.items.push(item)
  }
  order.status=clearText($item.find('.order-status').text())
  order.detailUrl = fixProtocol($item.find('.status a').attr('href'))
  return order
}
let tipInterval
let interval = setInterval(() => {

  const orderTableQuery = $('.order-tab')
  let orderTable
  const orders = []
  if (orderTableQuery.length > 0) {
    orderTable = orderTableQuery[0]
  }

  const orderItems = $('.order-tb tbody')
  const parentOrders = []
  try {
    if (orderItems) {
      const  tips = $('.status .tooltip') //这个时候肯定已经有了，可以直接执行mouse事件。
      for (const tip of tips) {
        //执行触发
        console.log(tip)
        $(tip).trigger('mouseenter')
      }
      tipInterval=setInterval(()=>{
        getExpressInfo()
      },1000)

      for (const item of orderItems) {
        const $item = $(item)
        const id = $item.attr('id')

        if (id.startsWith('parent-')) {
          //是父订单
          const parentOrder = getOrderInfo($item)
          parentOrder.id = id.replaceAll('parent-', '')
          parentOrders.push(parentOrder)
        } else {
          orders.push(getOrderInfo($item))
        }
      }

      console.log(orders)
      console.log(parentOrders)
      window.callbackData = {
        orders: orders,
        parentOrders: parentOrders,
      }
      // ipc.send('api.web.callback', {
      //   args: {
      //     status: 1,
      //     info: '成功获取',
      //     cbId: args.cbId,
      //     data:
      //   }
      // })
      clearInterval(interval)
    }

  } catch (error) {
    ipc.send('api.web.callback', {
      args: {
        cbId: args.cbId,
        status: 0,
        info: '获取报错',
        error: error
      }
    })
    clearInterval(interval)
  }

  //  ipc.send('closeSelf')

}, 1000)


function getExpressInfo(){
  function finish(){
    clearInterval(tipInterval)
    ipc.send('api.web.callback', {
      args: {
        status: 1,
        info: '成功获取',
        cbId: args.cbId,
        data:window.callbackData
      }
    })
    ipc.send('closeSelf')
  }
  const  tips = $('.status .tooltip') //这个时候肯定已经有了，可以直接执行mouse事件。
  if(tips.length===0){
    finish()
  }
  let got=false
  for (const tip of tips) {
    const orderId=$(tip).attr('_orderid')
    window.callbackData.orders.find(order=>{
      if(order.id===orderId){
         let nodes= $(tip).find('li')
        for(const node of nodes){
          const nodeItem={
            time:$(node).find('.time').text(),
            txt:clearText($(node).find('.txt').text())
          }
          order.latestNodes.push(nodeItem)
        }
        order.arrivalAt = $(tip).find('.logistics-cont .mt10').text()
        order.expressType = clearText($(tip).find('.p-tit').text()).replaceAll('查看更多>','')
        order.expressNo=order.expressType.substring(order.expressType.lastIndexOf('：')+1,order.expressType.length)
      }
    })
    got=true
  }
  if(got){
    finish()
  }
}
