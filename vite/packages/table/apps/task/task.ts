import { taskStore } from "./store";
import { appStore } from "../../store";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { completeTask as completeCurrentTask } from "./api";
import { h } from "vue";
import XtIfyIcon from "../../ui/new/IfyIcon/index";
import { message, notification } from "ant-design-vue";
import XtButton from "../../ui/libs/Button/index.vue";
export const startTask = (id) => {
  const store: any = taskStore();
  const { startList, completedList } = storeToRefs(store);
  if (startList.value.includes(id)) return true;

  startList.value.push(id);
};

export const completeTask = async (id) => {
  // 数据初始化

  id = id.toUpperCase()
  const type = id.split('')[0];
  const store: any = taskStore();
  const { startList, completedList, rewardVisible, currentId, currentType } =
    storeToRefs(store);

  // 判断任务是否开始
  if (!startList.value.includes(id)) return;

  // 移除开始中的任务
  startList.value = [...new Set(startList.value)].filter((item) => item !== id);

  // 数据预处理
  currentId.value = id;
  currentType.value = type;
  // // 完成任务
  // const app = appStore();
  // const { data, code } = await completeCurrentTask({
  //   taskName: id,
  //   uid: app.userInfo.uid,
  // });

  // const toast = useToast();
  //     toast.success("任务完成");
  const key = `open${Date.now()}`;
  const fn = () => {
    rewardVisible.value = true;
    notification.close(key);
  };
  notification["info"]({
    message: "任务完成！",
    description: "已完成「" + id + "」任务，点击领取奖励。",
    icon: () => h(XtIfyIcon, { size: 24, icon: "fluent-emoji:star" }),
    btn: () =>
      h(
        XtButton,
        {
          type: "theme",
          w: "84",
          h: 32,
          onClick: fn,
          radius: 8,
          plain: true,
        },
        { default: () => "立即领取" }
      ),
    key,
  });
};
