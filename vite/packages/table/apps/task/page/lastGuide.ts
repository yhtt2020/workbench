import { nanoid } from "nanoid";
import { cardStore } from "../../../store/card";
const desk1 = () => {
  const store: any = cardStore();
  let desk = {
    name: "任务桌面",
    id: nanoid(4),
    icon: "desktop",
    cards: [],
    layoutSize: {
      width: 1498,
      height: 466,
    },
  };
  // store.desks.push(desk);
  // console.log("store.desks :>> ", store.desks);
};
export const lastGuide = {
  M0202: () => {
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

    let desk = card.desks.find((item) => card.currentDeskId == item.id);
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
  M0303: () => {
    desk1();
    const card: any = cardStore();
    let desk = card.desks.find((item) => card.currentDeskId == item.id);
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
