import { navObj } from "../../../components/card/hooks/addCardToNav";

export const useMenus = (id?:number,item?:any) => {
  return {
    label: "添加到",
    newIcon: "fluent:add-16-regular",
    id:id,
    children: [
      {
        label: "添加到桌面",
        newIcon: "fluent:desktop-16-regular",
        callBack: () => {
          console.log("添加到桌面", item);
        },
      },
      {
        label: "添加到导航栏",
        newIcon: "fluent:tablet-16-regular",
        children: [
          {
            label: "主导航",
            newIcon: "fluent:tablet-16-regular",
            color:navObj.value.foot.state ? "var(--primary-text)" : "var(--secondary-text)",
            callBack: () => {
              console.log("foot", "主导航");
            },
          },
          {
            label: "左侧导航栏",
            newIcon: "fluent:panel-left-contract-16-regular",
            color:navObj.value.left.state ? "var(--primary-text)" : "var(--secondary-text)",
            callBack: () => {
              console.log("left", "左侧导航栏");
            },
          },
          {
            label: "右侧导航栏",
            newIcon: "fluent:panel-right-contract-16-regular",
            color:navObj.value.right.state ? "var(--primary-text)" : "var(--secondary-text)",
            callBack: () => {
              console.log("right", "右侧导航栏");
            },
          },
        ],
      },
    ],
  };
};
