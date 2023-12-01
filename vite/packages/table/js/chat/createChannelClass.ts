import { communityStore } from '../../page/chat/store/communityStore'

export const channelClass = {
 async secondaryChannel(data:any){
  console.log('执行...创建',data);
  
  const community:any = communityStore()
  const no = data.no;
  const option = {
   communityNo:data.no,
   role:'channel',
   parentId:data.id === undefined ? 0 : data.id,
   type:data.type
  }
  // 创建链接频道
  if(data.type === 'link'){ 
   const linkOption = {
    ...option,
    name:data.content.name,
    props:JSON.stringify(data.content.props),
   }
   community.createChannel(linkOption,no) 
  }
  // 创建群聊频道
  if(data.type === 'group' ){  
    const chatOption = {
      ...option,
      name:data?.content.name,
      props:JSON.stringify(data?.content.props)
    } 
    community.createChannel(chatOption,no)
  }
  // 创建社区频道
  if(data.type === 'forum'){
    const forumOption = {
      ...option,
      name:data.content.name,
      props:JSON.stringify(data.content)
    }
    community.createChannel(forumOption,no)
  }
  // 创建桌面频道
  if(data.type === 'desk'){  }

 },
 
}

