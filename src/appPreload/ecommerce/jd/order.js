const {
  $,
  ipc,
  args
} = require('../../app.js')
function clearText(text){
  return text.replaceAll('\n','').replaceAll(' ','').replaceAll('\t','')
}
function fixProtocol(url){
  return window.location.protocol+url
}
function getOrderInfo ($item) {
  const order = {
    id: '',
    dealtime: '',
    items: [],
    detailUrl:'',

    parentOrderId:''
  }
  if($item.get(0).classList.length>1){
    const dom=$item.get(0)
    dom.classList.forEach(cls=>{
      if(cls.startsWith('parent-')){
        order.parentOrderId=cls.replaceAll('parent-','')
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
      status: '',
      detailUrl:''
    }
    if($(child).hasClass('sep-tr-bd')) continue
    item.cover = fixProtocol($(child).find('.goods-item img').attr('src'))
    item.name = $(child).find('.p-msg .p-name a').attr('title')
    item.num=clearText($(child).find('.goods-number').text())
    item.consignee=$(child).find('.consignee .txt').text()
    item.amount=clearText($(child).find('.amount').text())
    item.status=clearText($(child).find('.order-status').text()) || order.items[0].status

    order.items.push(item)
  }
   order.detailUrl= fixProtocol($item.find('.status a').attr('href'))
  return order
}

let interval = setInterval(() => {
  const orderTableQuery = $('.order-tab')
  let orderTable
  const orders = []
  console.log('找一下订单信息')
  if (orderTableQuery.length > 0) {
    orderTable = orderTableQuery[0]
  }
  const goodItems = $('.order-tb tbody')
  console.log(goodItems)
  const parentOrders = []
  if (goodItems) {
    for (const item of goodItems) {
      const $item = $(item)
      const id = $item.attr('id')

      if (id.startsWith('parent-')) {
        //是父订单
        const parentOrder=getOrderInfo($item)
        parentOrder.id=id.replaceAll('parent-','')
        parentOrders.push(parentOrder)
      } else {
        orders.push(getOrderInfo($item))
      }
    }
    console.log('找到订单表', orderTable)

    console.log(orders)
    console.log(parentOrders)
    ipc.send('api.web.callback',{
      args:{
        cbId:args.cbId,
        data: {
          orders:orders,
          parentOrders:parentOrders,
        }
      }
    })
    clearInterval(interval)
    ipc.send('closeSelf')
  }
}, 1000)

