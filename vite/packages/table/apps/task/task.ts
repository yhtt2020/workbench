import { taskStore } from "./store";
import { appStore } from "../../store";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { completeCurrentTask } from "./api";

import Complete from "./components/Complete.vue";
// 完成任务
export const completeTask = async (id) => {
  const type: any = currentType(id);
  id = id.toUpperCase();
  if (type == "m") {
    completePrimaryTask(id);
  } else if (type == "z") {
    completeBranchTask(id);
  }
};

// 完成主线任务
export const completePrimaryTask = (id) => {
  const store: any = taskStore();
  const { startList, completedList, claimRewardsList } = storeToRefs(store);
  // 判断是否处于开始阶段
  // 转为全大写

  if (!startList.value.includes(id)) return;
  endTask(id);
};
// 完成支线任务
export const completeBranchTask = (id) => {
  const store: any = taskStore();
  const { startList, completedList, claimRewardsList } = storeToRefs(store);
  // 处于开始阶段
  if (startList.value.includes(id)) {
    endTask(id);
    return;
  }
  // 处于未完成阶段
  if (!completedList.value.includes(id) && !claimRewardsList.value.includes(id)) {
    endTask(id);
  }
};
// 获取指引
const getGuide = (id) => {
  const store: any = taskStore();
  const { startList, currentId, claimRewardsList, completedList } =
    storeToRefs(store);
  const toast = useToast();
  toast.clear();
  let config: any = {
    timeout: 0,
  };
  if (completedList.value.includes(id)) {
    config = { timeout: 3000, hideProgressBar: false };
  }

  toast(
    {
      component: Complete,
    },
    {
      icon: false,
      closeOnClick: false,
      closeButton: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      toastClassName: "notice-toast",
      ...config,
    }
  );
};

// 完成后任务后处理
const endTask = (id) => {
  const store: any = taskStore();
  const { startList, currentId, claimRewardsList, completedList } =
    storeToRefs(store);

  // 移除开始中的任务
  startList.value = [...new Set(startList.value)].filter((item) => item !== id);
  if (!completedList.value.includes(id)) {
    claimRewardsList.value.push(id);
  }
  // 数据预处理
  currentId.value = id;
  getGuide(id);
};
// 领取奖励
export const getReward = async (id) => {
  const toast = useToast();
  toast.clear();

  const app: any = appStore();
  const store: any = taskStore();
  const { startList, completedList, claimRewardsList, rewardVisible } =
    storeToRefs(store);
  id = id.toUpperCase();

  if (completedList.value.includes(id)) return;
  // 开始领取

  const { data, code } = await completeCurrentTask({
    taskName: id,
    uid: app.userInfo.uid,
  });
  // 清除数据
  store.claimRewardsList = [...new Set(store.claimRewardsList)].filter(
    (item) => item !== id
  );
  store.completedList.push(id);
  store.completedList = [...new Set(store.completedList)];
  const type = currentType(id);
  if (type == "m") {
    let res = store.getTask(id);
    store.taskID = res.suf;
  }

  return {
    data,
    code,
  };
};

export const currentType = (id) => {
  const type = id.split("")[0].toLowerCase();
  return type;
};
