import { communityStore } from '../../page/chat/store/communityStore'

export const channelClass = {
 
 async secondaryChannel(data:any){
  // console.log('获取参数::>>',data)
  const community:any = communityStore()
  
  const option = {
   communityNo:data.no,
   role:'channel',
   parentId:data.id,
   type:data.type
  }
  
  if(data.type === 'link'){ // 创建链接频道
   const linkOption = {
    ...option,
    name:data.content.name,
    props:JSON.stringify(data.content.props),
   }
   return await community.createChannel(linkOption)
  }

  if(data.type === 'group' && data?.content){  // 创建群聊频道
    if(data?.content.length > 1){
      console.log('多个',data.content);
      for(let i=0; i<data.content.length;i++){
        // const chatOption = {
        //   ...option,
        //   props:{groupID:data.content[i].groupID,name:data.content[i].name,avatar:data.content[i].avatar},
        // }
        // console.log('提交参数',chatOption);

        const res  = await community.createChannel( {
          ...option,
          props:JSON.stringify({groupID:data.content[i].groupID,avatar:data.content[i].avatar}),
          name:data.content[i].name
        })

        return res
        
      }


    }else{
      console.log('单个',data.content[0]);

      const res  = await community.createChannel( {
        ...option,
        props:JSON.stringify({groupID:data.content[0].groupID,avatar:data.content[0].avatar}),
        name:data.content[0].name
      })

      return res
    }
   
    
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

