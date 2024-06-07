import { useCustomLayout } from "./freeLayout/useCustomLayout";
import { headerData, mainData } from "./freeLayout/config";
import { useAddCard } from "../../hooks";
function deskMenus() {
  let currentHide = null;
  if (this.isFreeLayout) {
    currentHide = this.getFreeLayoutState?.system?.hide;
  } else {
    currentHide = this.hide;
  }
  return [
    {
      id: 0,
      newIcon: "fluent:add-16-filled",
      name: "测试组件",
      disabled: true,
      fn: () => {
        useAddCard({
          name: "AggregateSearch",
          data: {
            noBorder: false,
            currentSize: 2,
          },
        });
      },
    },
    {
      id: 0.2,
      newIcon: "fluent:add-16-filled",
      name: "定制桌面测试",
      disabled: true,
      fn: () => {
        useCustomLayout({
          headerList: headerData,
          mainList: mainData,
          cb: (position) => {},
        });
      },
    },
    {
      id: 1,
      newIcon: "fluent:add-16-filled",
      name: "添加图标",
      fn: this.newAddIcon,
    },
    {
      id: 2,
      newIcon: "fluent:collections-add-24-regular",
      name: "添加小组件",
      fn: this.newAddCard,
    },
    {
      id: 2.1,
      newIcon: "fluent:window-apps-16-regular",
      name: "应用中心",
      fn: this.newAppCenter,
    },
    {
      id: 3,
      newIcon: "fluent:apps-add-in-20-filled",
      name: "添加更多",
      children: [
        {
          id: 2,
          newIcon: "fluent:app-folder-16-regular",
          name: "添加图标分组",
          fn: this.addFolder,
        },
        {
          id: 3,
          newIcon: "mingcute:windows-line",
          name: "导入系统桌面图标",
          fn: this.arrange,
          disabled: !window.$usePlat("client"),
        },
      ],
    },
    { id: 5, divider: true },
    {
      id: 5.1,
      newIcon: "fluent:glance-horizontal-16-regular",
      name: "整理桌面",
      disabled: this.isFreeLayout ? false : true,
      fn: () => {
        window.$ui.confirm(
          "整理桌面",
          `整理桌面会将当前自由布局卡片重新规整排列`,
          {
            ok: () => {
              useCustomLayout({
                mainList: this.currentDesk.cards,
                // test: false,
                cb: (position) => {
                  this.$bus.emit("cutCanvas", position);
                },
              });
            },
            type: "warning",
          }
        );
      },
    },
    {
      id: 6,
      newIcon: this.editing
        ? "fluent:record-stop-16-regular"
        : "fluent:window-new-16-regular",
      name: this.editing ? "停止调整" : "调整桌面布局",
      fn: this.toggleEditing,
    },
    {
      id: 7,
      newIcon: "fluent:resize-large-16-regular",
      name: "复原桌面位置",
      disabled: this.isFreeLayout ? false : true,
      fn: this.freeLayoutScrollbarRedirect,
    },
    {
      id: 9,
      newIcon: "fluent:image-multiple-16-regular",
      name: "更换壁纸",
      fn: () => {
        this.$refs.galleryRef.openPaperAppModal();
      },
    },
    // {
    //   id: 10,
    //   disabled: false,
    //   name: "添加到导航栏",
    //   newIcon: "fluent:tablet-16-regular",
    //   lock: true,
    //   children: [
    //     {
    //       id: 1,
    //       newIcon: "fluent:tablet-16-regular",
    //       name: "底部导航",
    //       fn: () => {},
    //     },
    //     {
    //       id: 2,
    //       newIcon: "fluent:panel-left-contract-16-regular",
    //       name: "右侧导航",
    //       fn: () => {},
    //     },
    //     {
    //       id: 3,
    //       newIcon: "fluent:panel-right-contract-16-regular",
    //       name: "左侧导航",
    //       fn: () => {},
    //     },
    //   ],
    // },

    // { id: 13, divider: true },
    {
      id: 20,
      newIcon: "fluent:more-horizontal-16-filled",
      name: "更多",
      lock: true,
      children: [
        {
          id: 0,
          newIcon: "fluent:settings-16-regular",
          name: "系统设置",
          fn: () => {
            this.$bus.emit("openSystemSet");
          },
          // disabled: import.meta.env.DEV ? false : true,
        },
        {
          id: 1,
          newIcon: "fluent:settings-16-regular",
          name: "桌面设置",
          fn: this.showSetting,
        },
        {
          id: 7,
          newIcon: this.hide
            ? "fluent:eye-16-regular"
            : "fluent:eye-off-16-regular",
          name: currentHide ? "显示小组件" : "隐藏小组件",
          fn: () => {
            if (this.isFreeLayout) {
              this.getFreeLayoutState.system.hide =
                !this.getFreeLayoutState?.system?.hide;
            } else {
              if (this.hide) {
                this.showDesk();
              } else {
                this.hideDesk();
              }
            }
          },
          disabled: false,
        },
      ],
    },
  ];
}
export default {
  computed: {
    deskMenus,
  },
};
