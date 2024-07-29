import { useCustomLayout } from "../../../components/desk/freeLayout/useCustomLayout";
import {
  headerData,
  mainData,
} from "../../../components/desk/freeLayout/config";
import { generateSearchResultTime } from "../hooks/deskCreateMethod";
import { useAppModal } from "../../appModal/src/hook/useAppModal";


/**社群管理员模块**/
function communityMenus() {
  let currentHide = null;

  if (this.isFreeLayout) {
    currentHide = this.getFreeLayoutState?.system?.hide;
  } else {
    currentHide = this.comHide;
  }

  return [
    {
      id: 0,
      newIcon: "fluent:add-16-filled",
      name: "导入文件测试",
      disabled: true,
    },
    {
      id: 0,
      newIcon: "fluent:add-16-filled",
      name: "定制桌面测试",
      disabled: true,
      fn: () => {
        useCustomLayout({
          headerList: headerData,
          mainList: mainData,
          cb: (position: any) => {},
        });
      },
    },
    {
      id: 1,
      name: "更新桌面",
      newIcon: "fluent:cloud-arrow-up-16-filled",
      fn: this.syncSaveCommunity,
      contentAble: true,
      newContent:
        this.setting.saveSyncTime !== ""
          ? `上次更新:${generateSearchResultTime(this.setting.saveSyncTime)}`
          : "",
    },
    { id: 2, divider: true },
    {
      id: 3,
      newIcon: "fluent:add-16-filled",
      name: "添加图标",
      fn: () => {
        this.$nextTick(() => {
          this.$refs.currentDeskRef.newAddIcon();
        });
      },
    },
    {
      id: 4,
      newIcon: "fluent:collections-add-24-filled",
      name: "添加小组件",
      fn: this.newAddCard,
    },
    {
      id: 4.1,
      newIcon: "fluent:window-apps-16-filled",
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
          newIcon: "fluent:slide-add-16-filled",
          name: "添加新桌面",
          fn: this.showAddDeskForm,
        },
        {
          id: 2,
          newIcon: "fluent:app-folder-16-filled",
          name: "添加图标分组",
          fn: () => {
            this.$nextTick(() => {
              this.$refs.currentDeskRef.addFolder();
            });
          },
        },
      ],
    },
    { id: 6, divider: true },
    {
      id: 6.1,
      newIcon: "fluent:glance-horizontal-16-filled",
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
                cb: (position: any) => {
                  this.$bus.emit("cutCanvas", position);
                  setTimeout(()=>{
                    this.syncSaveCommunity();
                  },1500);
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
        ? "fluent:record-stop-16-filled"
        : "fluent:window-new-16-filled",
      name: this.editing ? "停止调整" : "调整桌面布局",
      fn: () => {
        this.$nextTick(() => {
          this.$refs.currentDeskRef.toggleEditing();
        });
      },
    },
    {
      id: 7,
      newIcon: "fluent:resize-large-16-filled",
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
      newIcon: "fluent:image-multiple-16-filled",
      name: "更换壁纸",
      fn: () => {
        const { openApp } = useAppModal("galleryModalApp");
        openApp();
        // this.$bus.emit("lockScreen");
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
          newIcon: "fluent:settings-16-filled",
          name: "系统设置",
          fn: () => {
            this.$nextTick(() => {
              this.$refs.currentDeskRef.showSystemSet();
            });
          },
        },
        {
          id: 1,
          newIcon: "fluent:settings-16-filled",
          name: "桌面设置",
          fn: () => {
            this.$nextTick(() => {
              this.$refs.currentDeskRef.showSetting();
            });
          },
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
          newIcon: "fluent:share-android-24-filled",
          name: "分享桌面",
          fn: this.shareDesk,
          // disabled: (window as any).$usePlat(),
        },
        {
          id: 6,
          newIcon: "fluent:circle-off-16-filled",
          name: "清空桌面",
          fn: () => {
            this.$nextTick(() => {
              this.$refs.currentDeskRef.clear(this.currentDesk);
            });
          },
        },
        {
          id: 7,
          newIcon: this.comHide
            ? "fluent:eye-16-filled"
            : "fluent:eye-off-16-filled",
          name: currentHide ? "显示小组件" : "隐藏小组件",
          fn: () => {
            this.$nextTick(() => {
              if (this.isFreeLayout) {
                this.getFreeLayoutState.system.hide =
                  !this.getFreeLayoutState?.system?.hide;
              } else {
                this.comHide = !this.comHide;
                if (this.comHide) {
                  this.$refs.currentDeskRef.showDesk();
                } else {
                  this.$refs.currentDeskRef.hideDesk();
                }
              }
            });
          },
          disabled: false,
        },
        {
          id: 8,
          newIcon: "akar-icons:trash-can",
          name: "删除桌面",
          fn: this.delDesk,
          color: "#FF4D4F",
        },
      ],
    },
  ];
}

/**社群成员模块**/
function memberMenus() {
  return [
    {
      id: 1,
      name: "更新桌面",
      newIcon: "fluent:cloud-arrow-up-16-filled",
      fn: () => {
        this.loadCommunityCloud();
        // this.$router.go(0);
      },
      contentAble: true,
      newContent:
        this.setting.getSyncTime !== ""
          ? `上次更新:${generateSearchResultTime(this.setting.getSyncTime)}`
          : "",
    },
    { id: 2, divider: true },
    {
      id: 3,
      newIcon: this.showRightMenu
        ? "fluent:record-stop-16-filled"
        : "fluent:window-new-16-filled",
      name: this.showRightMenu ? "停止调整" : "调整桌面布局",
      fn: () => {
        this.$nextTick(() => {
          // this.$refs.currentDeskRef.toggleEditing();
          this.showRightMenu = true;
        });
      },
    },
    {
      id: 4,
      newIcon: "fluent:resize-large-16-filled",
      name: "复原桌面位置",
      fn: () => {
        this.$nextTick(() => {
          this.$refs.currentDeskRef.freeLayoutScrollbarRedirect();
        });
      },
    },
    {
      id: 5,
      newIcon: "fluent:image-multiple-16-filled",
      name: "更换壁纸",
      fn: () => {
        // this.$bus.emit("lockScreen");
        const { openApp } = useAppModal("galleryModalApp");
        openApp();
      },
    },
    {
      id: 20,
      newIcon: "fluent:more-horizontal-16-filled",
      name: "更多",
      lock: true,
      children: [
        {
          id: 1,
          newIcon: "fluent:settings-16-filled",
          name: "桌面设置",
          fn: () => {
            console.log("桌面设置", this.displayDesks.length);
            if (this.displayDesks.length !== 0) {
              this.$nextTick(() => {
                this.$refs.currentDeskRef.showSetting();
              });
            }
          },
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
        // {
        //   id: 3,
        //   newIcon: "fluent:tablet-16-regular",
        //   name: "添加到导航栏",
        //   fn: () => {
        //     // let a = !this.fullScreen;
        //     // this.setFullScreen(a);
        //   },
        // },
      ],
    },
  ];
}

export default {
  computed: {
    communityMenus,
    memberMenus,
  },
};

/**先暂时注释,后期需要再使用**/
// {
//   id: 3,
//   newIcon: "mingcute:windows-line",
//   name: "导入系统桌面图标",
//   fn: () => {
//     this.$nextTick(() => {
//       this.$refs.currentDeskRef.arrange();
//     });
//   },
//   disabled: (window as any).$usePlat(),
// },
