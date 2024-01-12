import { taskStore } from "./store";
import { appStore } from "../../store";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { completeTask as completeCurrentTask } from "./api";

import Complete from "./components/Complete.vue";
export const startTask = (id) => {
  const store: any = taskStore();
  const { startList, completedList } = storeToRefs(store);
  if (startList.value.includes(id)) return true;

  startList.value.push(id);
};

export const completeTask = async (id) => {
  // 数据初始化

  id = id.toUpperCase();
  const type = id.split("")[0];
  const store: any = taskStore();
  const {
    startList,
    completedList,
    rewardVisible,
    currentId,
    currentType,
    claimRewardsList,
  } = storeToRefs(store);

  // 判断任务是否开始
  if (!startList.value.includes(id)) return;

  // 移除开始中的任务
  startList.value = [...new Set(startList.value)].filter((item) => item !== id);

  claimRewardsList.value.push(id);
  // 数据预处理
  currentId.value = id;
  currentType.value = type;
  //
  const toast = useToast();
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

// 领取奖励
export const getReward = async (id) => {
  const app: any = appStore();
  const store: any = taskStore();
  id = id.toUpperCase();
  // 开始领取
  const { data, code } = await completeCurrentTask({
    taskName: id,
    uid: app.userInfo.uid,
  });
  let res = store.getTask(id);
  // 清除数据
  store.claimRewardsList = [...new Set(store.claimRewardsList)].filter(
    (item) => item !== id
  );

  store.taskID = res.suf;
  return {
    data,
    code,
  };
};
