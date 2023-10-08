

const getDesk = () => {

  let name = "任务桌面" + Date.now();
  console.log('name :>> ', name);
  let obj = {
    name: "任务桌面",
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


    obj.titleValue = "合并图标";

  },
  M0303: async () => {
    let desk = getDesk();

  },
};
