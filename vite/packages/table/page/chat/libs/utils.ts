import { storeToRefs } from 'pinia';
import { communityStore } from '../store/communityStore';
import _ from 'lodash-es';

// 根据群聊id获取unreadCount
function getUnReadCount(groupID:any){
  // 群聊会话列表
  const list = (window as any).$TUIKit.store.store.TUIConversation.conversationList; 
  const find = list.find((item:any)=>{ 
    const itemInfo = item.groupProfile;
    return String(itemInfo.groupID) === String(groupID);
  });
  return { unreadCount:find.unreadCount };
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
  // const com:any = communityStore();
  // const { community } = storeToRefs(com); 
  // const list = community.value.communityTree;
  // console.log('执行.....1-1',list,no);
  
  // if(no !== undefined){
      //   const totalUnread = {
      //     unread:0
      //   };
      //   const list = [];
      //   const find = communityList.value.find((find)=>{
      //     return String(find.no) === String(no);
      //   })
      //   if(find !== undefined){
      //     for(const item of find.tree){
      //       if(item.hasOwnProperty('children') && item.children.length !== 0){
      //         for(const childrenItem of item.children){
      //           if(childrenItem.type === 'group'){
      //             const jsonChildren = JSON.parse(childrenItem.props);
      //             const index = _.findIndex(list,(find)=>{
      //              return String(find.groupID) === String(jsonChildren.groupID);
      //             })
      //             if(index === -1){
      //               list.push(childrenItem);
      //             }
      //           }
      //          }
      //       }else{
              
      //         if(item.type === 'group'){
      //           const jsonItem = JSON.parse(item.props);
      //           const index = _.findIndex(list,(find)=>{
      //           return String(find.groupID) === String(jsonItem.groupID);
      //           })
      //           if(index === -1){
      //             list.push(item);
      //           }
      //         }
      //       }
      //     }
      //   }
      //   for(const item of list){
      //     const jsonPropItem = JSON.parse(item.props);
      //     if(jsonPropItem.hasOwnProperty('unread')){
      //       totalUnread.unread += jsonPropItem.unread
      //     }else{
      //       totalUnread.unread = 0
      //     }
      //   }
      //   // console.log('执行...排查',totalUnread.unread);
      //   return totalUnread.unread;
  // }

  return {unread:0};
}

