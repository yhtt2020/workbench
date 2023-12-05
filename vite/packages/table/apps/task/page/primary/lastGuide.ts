import { nanoid } from "nanoid";
import { cardStore } from "../../../../store/card";
import { taskStore } from "../../store";

const getDesk = () => {
  const store: any = cardStore();
  const task: any = taskStore();
  task.deskID = nanoid(4);
  let name = "任务桌面" + Date.now();
  console.log("name :>> ", name);
  store.desks = store.desks.filter((item) => item.name !== name);
  let obj = {
    name: "任务桌面",
    id: task.deskID,
    icon: "desktop",
    cards: [],
    layoutSize: {
      width: 1498,
      height: 466,
    },
    settings: {
      cardMargin: 5,
      cardZoom: 100,
      marginTop: 0,
      enableZoom: true,
    },
  };
  store.desks.push(obj);
  store.currentDeskId = task.deskID;
  return store.desks.find((item) => task.deskID == item.id);
};
export const lastGuide = {
  M0202: () => {
    let desk = getDesk();
    let obj = {
      size: "mini",
      link: "link",
      linkValue: "",
      open: {
        value: "http://a.apps.vip/doc",
        type: "internal",
      },
      isTitle: true,
      titleValue: "移动图标",
      src: "http://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/mRdv-NzQq-plHV-ZKl_",
      isRadius: true,
      radius: 5,
      imgState: "cover",
      imgShape: "square",
      isBackground: false,
      backgroundColor: "",
      backgroundIndex: 0,
    };
    const card: any = cardStore();
    console.log("card :>> ", card);
    card.addCard(
      {
        name: "myIcons",
        id: Date.now() + 1,
        customData: { iconList: [{ ...obj }], copy: true },
      },
      desk
    );
    obj.titleValue = "合并图标";
    card.addCard(
      {
        name: "myIcons",
        id: Date.now() + 2,
        customData: { iconList: [{ ...obj }], merge: true },
      },
      desk
    );
  },
  M0303: async () => {
    let desk = getDesk();
    const card: any = cardStore();
    card.addCard(
      {
        name: "remote",
        id: Date.now() + 2,
        customData: { task: true },
      },
      desk
    );
  },
};
