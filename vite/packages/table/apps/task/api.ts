import { sUrl } from "../../consts";
import { post } from "../../js/axios/request";
// 查询全部任务
export const getAllTask = (data) => {
  const res = post(sUrl("/app/userTask/getAll"), data);
  return res;
};

// 完成一个任务
export const completeTask = (data) => {
  const res = post(sUrl("/app/userTask/done"), data);
  return res;
};

// 查看一个任务
export const getTaskStatus = (data) => {
  const res = post(sUrl("/app/userTask/getStatus"), data);
  return res;
};
