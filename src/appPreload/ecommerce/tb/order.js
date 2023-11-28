const {
  $,
  ipc,
  args,
  clearText,
  fixProtocol,
  intervalEvent,
  closeSelf,
  callback
} = require('../../app.js')

intervalEvent((clear) => {
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

function main () {
  let tipInterval
  intervalEvent((clear) => {

    const orderTableQuery = $('.order-tab')
    let orderTable
    const orders = []
    if (orderTableQuery.length > 0) {
      orderTable = orderTableQuery[0]
    }

    const orderItems = $('.js-order-container')
    const parentOrders = []
    try {
      if (orderItems) {
        // const  tips = $('.status .tooltip') //这个时候肯定已经有了，可以直接执行mouse事件。
        // for (const tip of tips) {
        //   //执行触发
        //   console.log(tip)
        //   $(tip).trigger('mouseenter')
        // }
        // tipInterval=setInterval(()=>{
        //   getExpressInfo()
        // },1000)

        for (const item of orderItems) {
          const $item = $(item)
          const id = $item.children('div').attr('data-id')

          if (id.startsWith('parent-')) {
            //是父订单
            const parentOrder = getOrderInfo($item)
            parentOrder.id = id.replaceAll('parent-', '')
            parentOrders.push(parentOrder)
          } else {
            orders.push({
              ...getOrderInfo($item),
              id: id
            })
          }
        }

        console.log(orders)
        console.log(parentOrders)
        callback({
          status: 1,
          orders: orders,
          info: '获取成功'
        })
        clear()
        //closeSelf()
      }

    } catch (error) {
      clear()
      callback({
        status: 0,
        info: '获取报错',
        error: error
      })
      closeSelf()
      // clearInterval(interval)
    }

    //  ipc.send('closeSelf')

  })

  function getExpressInfo () {
    function finish () {
      clearInterval(tipInterval)
      callback({
        status: 1,
        info: '成功获取',
        data: window.callbackData
      })
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
          order.updateTime = Date.now()
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
  order.dealtime = $item.find('.bought-wrapper-mod__create-time___yNWVS').text()

  const children = $item.find('tr')
  for (const child of children) {
    const item = {
      cover: '',
      name: '',
      num: 1,
      amount: '',
    }
    //if ($(child).hasClass('sep-tr-bd')) continue
    let imgSrc = $(child).find('.production-mod__pic___G8alD img').attr('src')
    if (!imgSrc) {
      continue
    }
    item.cover = fixProtocol(imgSrc)
    item.name = $(child).find('span[style=\'line-height:16px;\']').text()
    item.num = clearText($(child).find('.sol-mod__no-br___36X3g').eq(2).text())
    item.amount = $(child).find('.price-mod__price___3_8Zs strong').eq(2).text()
    order.items.push(item)
  }
  // const statusParent=$item.find('table tbody:eq(1) tr:eq(0) td:eq(5)')
  // console.log(statusParent)
  order.status = $item.find('tbody').eq(1).find('td').eq(5).find('p[style=\'margin-bottom:3px;\'] span.text-mod__link___1rXmw').text()
  const detail=$item.find('a').filter(function () {
    return $(this).text() === '查看物流'
  }).attr('href')
  if(detail){
    order.detailUrl = detail
  }else{
    order.detailUrl=null
  }

  return order
}

