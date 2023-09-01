import { useRouter } from "vue-router";
const router = useRouter();
export const guide = {
  M0101: [
    // 第一个变量负责定位和启动任务
    {
      type: "router",
      path: "home",
      fn: () => {
        // router.push({
        //   path: "home",
        // });
      },
    },
    {
      title: "",
      text: "",
      fn: () => {},
    },
  ],
};
