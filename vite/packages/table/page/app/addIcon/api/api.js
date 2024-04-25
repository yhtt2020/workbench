import { useDev } from "../../../../ui/hooks/useDev";
import service from "./request";
const homeRecommend = "/app/good/getGoodRecommend"; //首页推荐接口
const select = "/app/good/app/selectApp";
import web from './web.json'
// import isXT from "../../../../components/card/hooks/mode";
let appModel;
if (!useDev('h5')) {
  appModel  = window.$models.appModel
}
// 首页推荐
export const getRecommend = () => {
  return service.post(homeRecommend);
};

export const getSelect = (data) => {
  return service.post(select, { page: 1, limit: 100, ...data });
};
export const getNavList=()=>{
  return web
}
export const getQingApps = () => {
  return appModel.getAllApps();
};
