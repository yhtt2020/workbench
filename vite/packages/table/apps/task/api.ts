import { sUrl } from "../../consts";
import { post } from "../../js/axios/request";
// 查询全部任务
export const getAllTask = () => {
  // const option = {cache:1};
  // option
  const res = post(sUrl("/app/userTask/getAll"));
  return res;
};

// 完成一个任务
export const completeCurrentTask = (data) => {
  const res = post(sUrl("/app/userTask/done"), data);
  return res;
};

// 查看一个任务
export const getTaskStatus = (data) => {
  const res = post(sUrl("/app/userTask/getStatus"), data);
  return res;
};

// 获取积分
export const getTaskScore = () =>{
  const option = {cache:0};
  const res = post(sUrl("/app/com/scores/list"),option);
  return res;
}


// 获取积分所有商品
export const getPointProduct = async() =>{
  const res = await  post(sUrl("/app/scoreShop/getColumnList"));
  return res;
}

// 获取积分商品详情
export const getPointProductDetail = async(id:any) =>{
  const option = { id:id };
  const res = await post(sUrl("/app/scoreShop/detail"),option);
  return res;
}