import { communityStore } from '../../page/chat/store/communityStore'

export const channelClass = {
 
 async secondaryChannel(data:any){
  // console.log('获取参数::>>',data)
  const community:any = communityStore()
  
  const option = {
   communityNo:data.no,
   role:'channel',
   parentId:data.id === undefined ? 0 : data.id,
   type:data.type
  }
  
  if(data.type === 'link'){ // 创建链接频道
   // console.log('查看参数', data.content)

   const linkOption = {
    ...option,
    name:data.content.name,
    props:JSON.stringify(data.content.props),
   }
   
   //  console.log('查看参数::>>',linkOption)

   return await community.createChannel(linkOption)
  }

  if(data.type === 'group' ){  // 创建群聊频道
    const res  = await community.createChannel( {
      ...option,
      name:data?.content.name,
      props:JSON.stringify(data?.content.props)
    })
    return res
    
  }

  if(data.type === 'forum'){ // 创建社区频道
    // console.log('查看参数',data);
    const forumOption = {
      ...option,
      name:data.content.name,
      props:JSON.stringify(data.content)
    }

    return await community.createChannel(forumOption)
  }

  if(data.type === 'desk'){  // 创建桌面频道

  }
 }
}

