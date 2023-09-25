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

  if(data.type === 'group'){  // 创建群聊频道
    if(data.content.list.length > 1){

     for(let i=0;i<data.content.list.length;i++){
      const multipleGroup = {
       ...option,
       props:JSON.stringify({...data.content.list[i]}),
       name:data.content.list[i].name
      }
      // console.log('选择多个群聊时',multipleGroup)
      const res = await community.createChannel(multipleGroup)
      console.log('返回状态',res)
      return {status:res.data.status}
     }

    }else{
     const singleGroup = {
      ...option,
      props:JSON.stringify({...data.content.list}),
      name:data.content.list[0].name
     }
    //  console.log('选择单个群聊时',singleGroup)
      return await community.createChannel(singleGroup)

    }
  }

  if(data.type === 'community'){ // 创建社区频道

  }

  if(data.type === 'desk'){  // 创建桌面频道

  }
 }
}

