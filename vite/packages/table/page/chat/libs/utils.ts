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
 console.log('执行.....树状列表',list);
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

