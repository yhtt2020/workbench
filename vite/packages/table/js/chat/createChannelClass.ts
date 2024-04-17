import { CommunityAPI } from "../../apps/chat/api/communityAPI";

const comAPI: any = new CommunityAPI();
export const channelClass = {
  async secondaryChannel(data: any) {
    const { communityNo, item, parentID } = data;
    const option = {
      communityNo: communityNo,
      role: "channel",
      type: item?.type,
      parentId: parentID,
    };
    const createOption = {
      ...option,
      name: item?.item?.name,
      props: JSON.stringify({ type: item?.type, ...item?.item }),
    };
    console.log("测试", createOption);
    const res = await comAPI.createCommunityChannel(createOption);
    console.log("创建子级频道", res);
    if (res.status === 1) {
      return res;
    }
  },
};
