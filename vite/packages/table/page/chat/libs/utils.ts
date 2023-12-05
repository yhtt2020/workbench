import { storeToRefs } from 'pinia';
import { communityStore } from '../store/communityStore';

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
  const mapList = list.map((item:any)=>{
    // 判断是否存在子列表
    const hasChildren = item.hasOwnProperty('children'); 
    if(hasChildren){
      const childrenList = item.children.map((children:any)=>{
        const childrenType  = children.type === 'group';
        const jsonChildren = JSON.parse(children.props);
        if(childrenType){
          const result = getUnReadCount(jsonChildren.groupID);
          return {...item,props:{...jsonChildren,unread:result.unreadCount}};
        }

        else{
          return {...children,props:{...jsonChildren}};
        }
      })  
      return {...item,children:childrenList};
    }

    else {
      const type = item.type === 'group';
      const jsonProps = JSON.parse(item.props);
      if(type){
        const result = getUnReadCount(jsonProps.groupID);
        return {...item,props:{...jsonProps,unread:result.unreadCount}};
      }
      else {
        return {...item,props:{...jsonProps}};
      }
    }
  })
  return mapList;
 }
}

// 计算消息状态提示总数
export function communityTotal(no:any){
  const com:any = communityStore();
  const { community } = storeToRefs(com); 
  const list = community.value.communityTree;
  console.log('执行.....1-1',list,no);
  
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

