import { useCustomLayout } from "../../../components/desk/freeLayout/useCustomLayout";
import {
  headerData,
  folderData,
  mainData,
} from "../../../components/desk/freeLayout/config";

function communityMenus() {
  let currentHide = null;

  if (this.isFreeLayout) {
    currentHide = this.getFreeLayoutState?.system?.hide;
  } else {
    currentHide = this.hide;
  }

  return [
    {
      id: 1,
      name: "更新桌面",
      newIcon: "fluent:cloud-arrow-up-16-regular",
      fn: this.sysSaveCommunity,
    },
    { id: 2, divider: true },
    {
      id: 3,
      newIcon: "fluent:add-16-filled",
      name: "添加图标",
      fn: this.addIcon,
    },
    {
      id: 4,
      newIcon: "fluent:collections-add-24-regular",
      name: "添加小组件",
      fn: this.newAddCard,
    },
    {
      id: 4.1,
      newIcon: "fluent:window-apps-16-regular",
      name: "应用中心",
      fn: () => {
        this.$nextTick(() => {
          this.$refs.currentDeskRef.newAppCenter();
        });
      },
    },
    {
      id: 5,
      newIcon: "fluent:apps-add-in-20-filled",
      name: "添加更多",
      children: [
        {
          id: 1,
          newIcon: "fluent:slide-add-16-regular",
          name: "添加新桌面",
          fn: this.showAddDeskForm,
        },
        {
          id: 2,
          newIcon: "fluent:app-folder-16-regular",
          name: "添加图标分组",
          fn: () => {
            this.$nextTick(() => {
              this.$refs.currentDeskRef.addFolder();
            });
          },
        },
        {
          id: 3,
          newIcon: "mingcute:windows-line",
          name: "导入系统桌面图标",
          fn: () => {
            this.$nextTick(() => {
              this.$refs.currentDeskRef.arrange();
            });
          },
          disabled: (window as any).$usePlat(),
        },
      ],
    },
    { id: 6, divider: true },
    {
      id: 6.1,
      newIcon: "fluent:glance-horizontal-16-regular",
      name: "整理桌面",
      disabled: this.isFreeLayout ? false : true,
      fn: () => {
        (window as any).$ui.confirm(
          "整理桌面",
          `整理桌面会将当前自由布局卡片重新规整排列`,
          {
            ok: () => {
              useCustomLayout({
                mainList: this.currentDesk.cards,
                // test: false,
                cb: (position: any) => {
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
      fn: () => {
        this.$nextTick(() => {
          this.$refs.currentDeskRef.toggleEditing();
        });
      },
    },
    {
      id: 7,
      newIcon: "fluent:resize-large-16-regular",
      name: "复原桌面位置",
      disabled: this.isFreeLayout ? false : true,
      fn: () => {
        this.$nextTick(() => {
          this.$refs.currentDeskRef.freeLayoutScrollbarRedirect();
        });
      },
    },
    {
      id: 9,
      newIcon: "fluent:image-multiple-16-regular",
      name: "更换壁纸",
      fn: () => {
        this.$refs.galleryRef.openPaperAppModal();
      },
    },
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
          // fn: this.showSystemSet,
        },
        {
          id: 1,
          newIcon: "fluent:settings-16-regular",
          name: "桌面设置",
          // fn: this.showSetting,
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
        {
          id: 2,
          newIcon: "fluent:full-screen-maximize-16-filled",
          name: "全屏桌面",
          fn: () => {
            let a = !this.fullScreen;
            this.setFullScreen(a);
          },
        },
        {
          id: 3,
          newIcon: "fluent:arrow-download-20-filled",
          name: "导入桌面",
          fn: this.importDesk,
        },

        {
          id: 4,
          newIcon: "fluent:open-20-filled",
          name: "导出桌面",
          fn: this.exportDesk,
        },
        {
          id: 5,
          newIcon: "fluent:share-android-24-regular",
          name: "分享桌面",
          fn: this.shareDesk,
          disabled: (window as any).$usePlat(),
        },
        {
          id: 9,
          newIcon: "akar-icons:trash-can",
          name: "删除桌面",
          fn: this.delDesk,
          color: "#FF4D4F",
        },
      ],
    },
  ];
}

export default {
  computed: {
    communityMenus,
  },
};
