import _ from 'lodash-es';

// 根据群聊id获取unreadCount
function getUnReadCount(groupID:any){
  const server = (window as any).$TUIKit.TUIServer.TUIConversation;
  const list =server.store.conversationList;
  if(list){
    const find = _.find(list,function(item:any){ const itemInfo = item.groupProfile; return String(itemInfo?.groupID) === String(groupID); });
    if(find){ return { unreadCount:find?.unreadCount }; }
    else { return { unreadCount:0 }; }
  }
}

// 将社群频道目录进行更换
export function updateTree(list:any){
  const listNull = list.length !== 0;
  if(listNull){
    const mapList = list.map((mapItem:any)=>{
      const hasChildren = mapItem.hasOwnProperty('children');
      if(hasChildren){
        const children = mapItem.children.map((item:any)=>{
          const type = item.type === 'group';
          const jsonItem = JSON.parse(item.props);
          if(type){
            const result:any = getUnReadCount(jsonItem.groupID);
            return {...item,props:{...jsonItem,unread:result?.unreadCount}}
          }

          else{
            return {...item,props:{...jsonItem}}
          }
        })
        return {...mapItem,children:[...children]}
      }
      else{
        const isGroup = mapItem.type === 'group';
        if(isGroup){
          const jsonItem = JSON.parse(mapItem.props);
          const result:any = getUnReadCount(jsonItem.groupID);
          const option = {...mapItem,props:{...jsonItem,unread:result?.unreadCount}};
          return option;
        }
        else {
          const jsonItem = JSON.parse(mapItem.props);
          if(jsonItem !== null){
            const option = {...mapItem,props:{...jsonItem}};
            return option;
          }
          else {
            const option =  {...mapItem,props:null}
            return option;
          }
        }
      }
    })
    return mapList
  }
  else {
   return []
  }
}

// 计算消息状态提示总数
export function communityTotal(no:any,list:any){
  // 通过no进行列表匹配
  const find = _.find(list,function(find:any){ return String(find.no) === String(no) });
  if(find !== undefined){
    const arr = find.tree;
    const mergedList:any = [];
    const totalUnread = {
      unread:0,
    }
    // 去重push到mergedList
    const index = _.findIndex(mergedList,function(find:any){ return String(find.no) === String(no) });
    for(const item of arr){
      const hasChildren =  item.hasOwnProperty('children');
      const itemType = item.type === 'group';
      if(hasChildren){
        for(const children of item.children){
          const type = children.type === 'group';
          if(type && index === -1){
            mergedList.push(children as never);
          }
        }
      }
      if(itemType && index === -1){
        mergedList.push(item as never);
      }
    }
    if(mergedList.length !== 0){
      for(const item of mergedList){
        totalUnread.unread += item.props.unread;
      }
    }
    else { totalUnread.unread = 0; }
    return totalUnread.unread === 0  ? 0 : totalUnread.unread > 99 ? 99 : totalUnread.unread;
  }
  else { return 0 }
}

