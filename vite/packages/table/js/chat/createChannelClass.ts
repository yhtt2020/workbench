import { communityStore } from '../../page/chat/store/communityStore'

export const channelClass = {
 async secondaryChannel(data:any){
  const community:any = communityStore();
  const option = {
   communityNo:data.no, role:'channel',type:data.type,
   parentId:data.id === undefined ? 0 : data.id,
  };
  const createOption = { ...option,name:data.content.name,props:JSON.stringify(data.content.props),};
  community.createChannel(createOption,data.no) ;
 },
}

