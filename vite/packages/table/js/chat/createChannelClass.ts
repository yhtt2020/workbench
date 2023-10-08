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
    // console.log('容错',data?.content?.length > 1)

    if(data?.content?.length > 1){

      for(let i=0;i<data.content.length;i++){
        const multipleGroup = {
          ...option,
          props:JSON.stringify({...data.content[i]}),
          name:data.content[i].name
        }
        
        // console.log('排查问题', multipleGroup)

        return  community.createChannel(multipleGroup)
      }

    }else{

      const singleGroup = {
        ...option,
        props:JSON.stringify({...data.content}),
        name:data.content[0].name
      }

      // console.log('排查问题', singleGroup)

      return  community.createChannel(singleGroup)

    }



    // if(data?.content?.length > 1){

    //  for(let i=0;i<data.content.length;i++){
      
    //   console.log('选择多个群聊时',multipleGroup)
    //   const res = await community.createChannel(multipleGroup)
    //   console.log('返回状态',res)
    //   return res
    //  }

    // }else{
     
    //  console.log('选择单个群聊时',singleGroup)
    //  return await community.createChannel(singleGroup)

    // }
  }

  if(data.type === 'community'){ // 创建社区频道

  }

  if(data.type === 'desk'){  // 创建桌面频道

  }
 }
}

