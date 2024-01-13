import { taskStore } from "./store";
import { appStore } from "../../store";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { completeTask as completeCurrentTask } from "./api";

import Complete from "./components/Complete.vue";
// 完成任务
export const completeTask = async (id) => {
  const type: any = currentType(id);
  if (type == "m") {
    completePrimaryTask(id);
  } else if (type == "z") {
    completeBranchTask(id);
  }
};

// 完成主线任务
export const completePrimaryTask = (id) => {
  endTask(id);
};
// 完成支线任务
export const completeBranchTask = (id) => {
  const store: any = taskStore();
  const { startList, completedList, claimRewardsList } = storeToRefs(store);
  // 判断是否已完成
  if (
    completedList.value.includes(id) ||
    claimRewardsList.value.includes(id) ||
    startList.value.includes(id)
  )
    return;
  endTask(id);
};
// 获取指引
const getGuide = () => {
  const toast = useToast();
  toast.clear();

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
      timeout: 0,
      toastClassName: "notice-toast",
    }
  );
};

// 完成后任务后处理
const endTask = (id) => {
  const store: any = taskStore();
  const { startList, currentId, claimRewardsList } = storeToRefs(store);

  if (!startList.value.includes(id)) return;

  // 移除开始中的任务
  startList.value = [...new Set(startList.value)].filter((item) => item !== id);
  claimRewardsList.value.push(id);
  // 数据预处理
  currentId.value = id;
  getGuide();
};
// 领取奖励
export const getReward = async (id) => {
  const toast = useToast();
  toast.clear();

  const app: any = appStore();
  const store: any = taskStore();
  id = id.toUpperCase();
  // 开始领取
  const { data, code } = await completeCurrentTask({
    taskName: id,
    uid: app.userInfo.uid,
  });

  // 清除数据
  store.claimRewardsList = [...new Set(store.claimRewardsList)].filter(
    (item) => item !== id
  );
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
