import { storeToRefs } from 'pinia';
import { communityStore } from '../store/communityStore';
import _ from 'lodash-es';

// 根据群聊id获取unreadCount
function getUnReadCount(groupID:any){
  // 群聊会话列表
  const list = (window as any).$TUIKit.store.store.TUIConversation.conversationList;
  const find = list.find((item:any)=>{
    const itemInfo = item.groupProfile;
    return String(itemInfo?.groupID) === String(groupID);
  });
  if(find){
    return { unreadCount:find.unreadCount };
  }else{
    return 0
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
            const result = getUnReadCount(jsonItem.groupID);
            return {...item,props:{...jsonItem,unread:result.unreadCount}}
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
          const result = getUnReadCount(jsonItem.groupID);
          const option = {...mapItem,props:{...jsonItem,unread:result.unreadCount}};
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
export function communityTotal(no:any){
  const com:any = communityStore();
  const { community } = storeToRefs(com);
  const list = community.value.communityTree;
  const find = _.find(list,function(find:any){ return String(find.no) === String(no) });
  if(find !== undefined){
    // 获取树状数据结构列表
    const arr = find.tree;
    const arrList:any = [];
    const unreadTotal = {
      unread:0,
    };
    for(const item of arr){
      const type = item.type === 'group';
      const hasChildren = item.hasOwnProperty('children');
      if(type){
        const jsonProp = item.props;
        const index = _.findIndex(arrList,function(find:any){ return String(find.props.groupID) === String(jsonProp.groupID) });
        if(index === -1){
          arrList.push(item as never);
        }
      }
      if(hasChildren){
        for(const childrenItem of item.children){
          const childrenType = childrenItem.type === 'group';
          if(childrenType){
            const jsonItem = childrenItem.props;
            const childrenIndex = _.find(arrList,function(find:any){ return String(find.props.groupID) === String(jsonItem.groupID); });
            if(childrenIndex === -1){
              arrList.push(childrenItem as never);
            }
          }
        }
      }

    }
    if(arrList.length !== 0){
      for(const item of arrList){
        unreadTotal.unread += item.unread;
      }
    }
    return { unread:unreadTotal.unread === 0 ? 0 : unreadTotal.unread > 99 ? 99 : unreadTotal.unread };
  }
  return {unread:0};
}

