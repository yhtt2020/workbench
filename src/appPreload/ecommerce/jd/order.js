const {
  $,
  ipc,
  args,
  clearText,
  fixProtocol,
  callback,
  intervalEvent,
  closeSelf
} = require('../../app.js')
const {
  getNickname,isLogged,loaded
}=require('./util')

let tipInterval
intervalEvent((clear) => {
  if(loaded()){
    if(!isLogged()){
      clear()
      callback({
        status:0,
        info:'京东掉登录',
        code:401,
      })
      closeSelf()
    }
  }
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
      const tips = $('.status .tooltip') //这个时候肯定已经有了，可以直接执行mouse事件。
      for (const tip of tips) {
        //执行触发
        $(tip).trigger('mouseenter')
      }
      tipInterval = setInterval(() => {
        getExpressInfo()
      }, 1000)

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
      clear()

    }

  } catch (error) {
    callback(
      {
        cbId: args.cbId,
        status: 0,
        info: '获取报错',
        error: error
      })
    clear()
  }

  //  ipc.send('closeSelf')

}, 1000)

function getExpressInfo () {
  function finish () {
    clearInterval(tipInterval)
    callback({
        status: 1,
        info: '成功获取',
        cbId: args.cbId,
        data: window.callbackData
      }
    )
    closeSelf()
  }

  const tips = $('.status .tooltip') //这个时候肯定已经有了，可以直接执行mouse事件。
  if (tips.length === 0) {
    finish()
  }
  let got = false
  for (const tip of tips) {
    const orderId = $(tip).attr('_orderid')
    window.callbackData.orders.find(order => {
      if (order.id === orderId) {
        let nodes = $(tip).find('li')
        for (const node of nodes) {
          const nodeItem = {
            time: $(node).find('.time').text(),
            txt: clearText($(node).find('.txt').text())
          }
          order.latestNodes.push(nodeItem)
        }
        order.arrivalAt = $(tip).find('.logistics-cont .mt10').text()
        order.expressType = clearText($(tip).find('.p-tit').text()).replaceAll('查看更多>', '')
        order.expressNo = order.expressType.substring(order.expressType.lastIndexOf('：') + 1, order.expressType.length)
      }
    })
    got = true
  }
  if (got) {
    finish()
  }
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
  order.amount=$item.find('tr').eq(2).find('td div.amount span').eq(0).text()

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
    if ($(child).hasClass('sep-tr-bd')) continue //排除掉错误数据
    let lazyCover=$(child).find('.goods-item img').attr('data-lazy-img')
    item.cover = lazyCover!=='done'?fixProtocol(lazyCover): fixProtocol($(child).find('.goods-item img').attr('src'))
    item.name = $(child).find('.p-msg .p-name a').attr('title')
    item.num = clearText($(child).find('.goods-number').text())
    item.consignee = $(child).find('.consignee .txt').text()
    item.amount = clearText($(child).find('.amount').text())

    order.items.push(item)
  }
  order.status = clearText($item.find('.order-status').text())
  order.detailUrl = fixProtocol($item.find(".status a").filter(function (){
    return $(this).text()==='订单详情'
  }).attr('href'))
  return order
}
