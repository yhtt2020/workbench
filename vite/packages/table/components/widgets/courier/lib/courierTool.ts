import {  kdCompany, kdState, switchColor} from "./mock";

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
    if (content.latestNodes && content.latestNodes.length > 0) {
      newItem.lastNodeTime = content.latestNodes[0]?.time
      newItem.lastNodeSummary = content.latestNodes[0]?.txt
    }
  } else if(newItem.store==='tb'){
    newItem.company = content.expressType.slice(0, content.expressType.indexOf('快递') + 2)
    newItem.stateText = content.status
    if (content.latestNodes && content.latestNodes.length > 0) {
      newItem.lastNodeTime = content.latestNodes[0]?.time
      newItem.lastNodeSummary = content.latestNodes[0]?.txt
    }
  }
  newItem.tagColor=convertStatusToColor(getOrderState(item))
  console.log('取到的状态',getOrderState(item))
  console.log('取到的标签颜色',newItem.tagColor)
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
    return getKdniaoState(order)
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

/**
 * 获取快递鸟的订单状态
 * @param order
 */
export function getKdniaoState(order){
  switch (order.content.State) {
    case '202':
      return 'delivery'
    case '2':
      return 'onRoad'
    case '1':
      return 'collected'
    case '3':
      return 'signed'
    default:
      return order.content.State
  }
}

/**
 * 转换订单的状态为颜色
 * @param status
 */
export function convertStatusToColor(status){
  switch (status) {
    case "onRoad":
      return '#508BFE';//暂无轨迹信息
      break;
    case "collected":
      return '#43CADE';//已揽收
      break;
    case "onRoad":
      return '#508BFE';//在途中
      break;
    case "signed":
      return '#52c31a';//签收
      break;
    case 'delivery':
      return '#FA7B14';
    case 'canceled':
      return '#464646';
    case "4":
      return '#FF4D4F ';//问题件
      break;
    case "5":
      return '#FF4D4F ';//转寄
      break;
    case "6":
      return '#FF4D4F '; //清关
      break;

    default:
      return '#508BFE';
  }
}
