import { useRouter } from "vue-router";
export const guide = {
  M0101: [
    // 第一个变量负责定位和启动任务
    {
      fn: () => {
        const router = useRouter();
        console.log('router :>> ', router);
        router?.push({
          path: "home",
        });
      },
    },
    {
      title: "桌面操作菜单",
      text: "点击这里（或桌面空白处「单击右键键」），打开桌面的底部操作栏，可以选择桌面相关的功能操作。",
      fn: () => {},
    },
  ],
};
