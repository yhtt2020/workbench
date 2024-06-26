import { storeToRefs } from "pinia";
import { taskStore } from "./store";
import _ from "lodash-es";

// 根据当前任务章节遍历获取全部奖励
export const getCurrentTaskReward = (id: any) => {
  const task = taskStore();
  const { currentTaskList } = storeToRefs(task);
  const result: any = currentTaskList.value.find(
    (item: any) => item.name == id
  );
  if (result) {
    let { awardList } = result;
    let arr: any = [];
    for (const arrItem of awardList) {
      if (arrItem.label == "道具") {
        arr.push({
          name: "头像",
          type: "avatarFrame",
          icon: arrItem.data.icon,
          data: arrItem.data,
        });
      } else if (arrItem.label == "勋章") {
        arr.push({
          type: "medal",
          icon: arrItem.data.icon_lg,
          data: arrItem.data,
        });
      } else if (arrItem.label == "积分") {
        if (arrItem.data.name == "社区积分") {
          arr.push({ type: "communityPoints", value: arrItem.origin.value });
        } else {
          arr.push({ type: "experience", value: arrItem.origin.value });
        }
      }
    }
    return arr;
  } else {
    return null;
  }
};

// 判断是否完成主线任务
export const getUnFinishTaskStatus = () => {
  const task = taskStore();
  const { currentTaskList } = storeToRefs(task);
  const result: any = currentTaskList.value.find(
    (item: any) => item.name == "M0302"
  );
  // console.log("result",result);
  return result;
};

/**
 *根据任务的id判断主线任务是否完成和当前支线任务是否完成 
 *用途:
  修复已经完成任务的情况下，重新安装，再触发还是会弹窗完成任务弹窗这个bug,
  所以临时加一个方法
 * **/
export const isTaskFinish = (id: any) => {
  const { currentTaskList } = storeToRefs(taskStore());
  // 主线任务是否已经完成的判断
  const mtFinishVisible = _.every(currentTaskList.value, (task: any) => {
    if (task?.type === "main") {
      return task?.done === 1;
    }
  });

  console.log('测试',mtFinishVisible);
  

  // 根据id获取当前支线任务判断是否已经完成
  const ztFinishVisible = _.find(currentTaskList.value, (task: any) => {
    return task?.type === "branch" && String(task?.name) === String(id);
  });
  

  return mtFinishVisible && ztFinishVisible?.done === 0;
};
