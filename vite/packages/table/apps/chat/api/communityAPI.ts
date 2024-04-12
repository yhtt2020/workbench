// 群聊API
import { post } from "../../../js/axios/request";
import { sUrl } from "../../../consts";

export class CommunityAPI {
  // 获取我的社群
  async getMyCommunityList(data: any) {
    const res = await post(sUrl("/app/community/my"), data);
    return res;
  }

  // 创建社群
  async createMyCommunity(data: any) {
    const res = await post(sUrl("/app/community/create"), data);
    return res;
  }

  // 申请加入社群
  async applyJoinCommunity(data: any) {
    const res = await post(sUrl("/app/community/join"), data);
    return res;
  }

  //获取某个社群的详细信息
  async getDetailCommunity(data: any) {
    const res = await post(sUrl("/app/community/getByNo"), data);
    return res;
  }

  // 热门社群
  async getHotCommunity(data: any) {
    const res = await post(sUrl("/app/community/getHotList") , data);
    return res;
  }

  // 获取推荐社群
  async getReferralCommunity(data:any){
   const res  = await post(sUrl("/app/community/getRecommendList"),data);
   return res;
  }

  //社群搜索
  async communitySearch(data:any){
    const res = await post(sUrl("/app/community/searchCommunity"),{keywords:data});
    return res;
  }

  // 获取社群频道列表
  async getCommunityListChannel(data:any){
    const res  = await post(sUrl("/app/community/channel/getList"),data);
    return res;
  }
  // 获取社群树状频道列表
  async getCommunityTreeListChannel(data:any){
    const res  = await post(sUrl("/app/community/channel/getTreeList"),data);
    return res;
  }

  // 创建社群频道
  async createCommunityChannel(data:any){
    const res = await post(sUrl("/app/community/channel/create"),data);
    return res;
  }

  // 删除社群频道
  async deleteCommunityChannel(data:any){
    const res  = await post(sUrl("/app/community/channel/remove"),data);
    return res;
  }

  // 更新社群频道
  async updateCommunityChannel(data:any){
    const res  = await post(sUrl("/app/community/channel/updateProfile"),data);
    return res; 
  }
}

