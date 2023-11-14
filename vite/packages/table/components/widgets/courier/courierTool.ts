import {convertJdStatusColor, kdCompany, kdState, switchColor} from "./mock";

export function preHandle(list){
 return  [...list.map(item => {
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
      console.log('content=', content)
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
    }
    return newItem
  })]
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
