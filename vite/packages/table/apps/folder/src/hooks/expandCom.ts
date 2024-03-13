import { defaultFolderData } from "../components/options";
import { nanoid } from "nanoid";

export const expandData = () => {
  return {
    customData: {
      ...defaultFolderData,
      list: [
        {
          icon: "/img/bottomPanel/my.png",
          name: "我的",
          value: "socialMy",
          type: "systemApp",
          id: nanoid(6),
        },
        {
          icon: "/img/bottomPanel/team.png",
          name: "小队",
          type: "fixed",
          id: nanoid(6),
          value: "team",
        },
        {
          icon: "/img/bottomPanel/rank.png",
          name: "榜单",
          value: "rank",
          type: "systemApp",
          id: nanoid(6),
        },
        {
          icon: "/img/bottomPanel/prop.png",
          name: "我的道具",
          type: "fixed",
          id: nanoid(6),
          value: "myProp",
        },
        {
          icon: "/img/bottomPanel/market.png",
          name: "道具商城",
          value: "prop",
          type: "systemApp",
          id: nanoid(6),
        },
        {
          icon: "/img/task/star.png",
          name: "任务",
          value: "task",
          type: "systemApp",
          id: nanoid(6),
        },
      ],
      customSize:'6x5',
      name:'社区中心',
      layout:'rows'
    },
    expand:{
        disabled:true
    },
    navBar:{
        resize:false,
        sizeOption:false,
        bg:false,
        isDel:true,
        hierarchy:true,
    },
    customIndex:Date.now(),
    auto:false,
    modalSize:'6x5',
    secondary: {},
  };
};
