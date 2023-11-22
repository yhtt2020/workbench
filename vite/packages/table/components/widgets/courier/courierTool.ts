import {convertJdStatusColor, kdCompany, kdState, switchColor} from "./mock";

export function preHandle(list){
 return  [...list.map(item => {
    return preHandleItem(item)
  })]
}

export function preHandleItem(item){
  let newItem = {
    ...item
  }

  let content = item.content
  if (!newItem.store) {
    //快递鸟快递
    newItem.tagColor = switchColor(content.state)
    newItem.stateText = kdState(content.State)
    newItem.company = kdCompany(content.ShipperCode)
    if (content.Traces && content.Traces.length > 0) {
      newItem.lastNodeTime = content.Traces[content.Traces.length - 1]?.AcceptTime
      newItem.lastNodeSummary = content.Traces[content.Traces.length - 1]?.AcceptStation
    }
  } else if (newItem.store === 'jd') {
    if (!content.expressType) {
      newItem.company = '京东快递'
    } else {
      newItem.company = content.expressType.slice(0, content.expressType.indexOf('快递') + 2)
    }
    newItem.stateText = content.status
    newItem.tagColor = convertJdStatusColor(content.status)
    if (content.latestNodes && content.latestNodes.length > 0) {
      newItem.lastNodeTime = content.latestNodes[0]?.time
      newItem.lastNodeSummary = content.latestNodes[0]?.txt
    }
  } else if(newItem.store==='tb'){
    newItem.company = content.expressType.slice(0, content.expressType.indexOf('快递') + 2)
    newItem.stateText = content.status
    newItem.tagColor = convertJdStatusColor(content.status)
    if (content.latestNodes && content.latestNodes.length > 0) {
      newItem.lastNodeTime = content.latestNodes[0]?.time
      newItem.lastNodeSummary = content.latestNodes[0]?.txt
    }
  }
  return newItem
}

/**
 * 根据不同类型的订单自动生成订单标题
 * @param orderContent
 * @param store
 */
export function generateTitle(orderContent,store=''){
  if(!store){
    return orderContent.LogisticCode.slice(0,6) + '-' + orderContent.LogisticCode.slice(-6)
  }else if(store==='jd'){
    return orderContent.items[0].title
  }
}



/**
 * 统一获取标准化的订单状态
 * @param order
 */
export function getOrderState(order){
  const states=['onRoad','delivery','preparing','signed','collected','canceled']
  const words=['在途中','派送中','发货中','已签收','已揽收']
  if(order.store==='jd'){
    //京东订单处理
    return getJdState(order)
  }else if(order.store==='tb')
  {
    //淘宝订单处理
    return getTbState(order)
  }else if(order.store=='pdd'){

  }else{
    return getExpressState(order)
  }

}
export function getJdState(order){
  switch (order.content.status){
    case '等待收货':
      return 'onRoad'
    case '正在出库':
      return 'preparing'
    case '已完成':
      return 'signed'
    case '已取消':
      return 'canceled'
  }
}
export function getTbState(order){
  switch (order.content.status){
    case '卖家已发货':
      return 'onRoad'
    case '正在出库':
      //淘宝不存在这个状态
      return 'preparing'
    case '交易成功':
      return 'signed'
    case '交易关闭':
      return 'canceled'
  }
}
export function getExpressState(order){
  switch (order.content.State) {
    case '202':
      return 'delivery'
    case '2':
      return 'onRoad'
    case '1':
      return 'collected'
    case '3':
      return 'signed'
  }
}
