import { cardStore } from "../../../store/card";

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
    let obj = {
      name: "remote",
      cname: "外部小组件",
      detail: "添加一个链接到外部网页的小组件，可以实现各种自定义功能",
      sizes: ["社区分享", "自定义大小"],
      option: [
        {
          name: "Remote",
          size: "自定义大小",
          zoom: "11",
        },
      ],
      time: 1685462400000,
      download: 5301,
    };
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
