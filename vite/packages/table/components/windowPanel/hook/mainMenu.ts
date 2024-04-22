function mainMenus() {
  return [
    {
      id: 1,
      newIcon: "fluent:add-16-regular",
      name: "添加导航图标",
      fn: () => {
        this.editNav(this.drawerMenus[0]);
      },
    },
    {
      id: 2,
      name: "导航栏设置",
      newIcon: "fluent:settings-16-regular",
      fn: () => {
        this.$bus.emit("openSystemSet");
        setTimeout(() => {
          this.$bus.emit("selectSystemNav", 3);
        }, 10);
      },
    },
    {
      id: 3,
      name: "关闭当前导航",
      newIcon: "fluent:eye-off-16-regular",
      fn: () => {
        this.$emit("hiedNavBar", this.sortId);
      },
    },
    {
      id: 4,
      name: "清空当前导航栏",
      newIcon: "fluent:circle-off-16-regular",
      fn: () => {
        this.clearAll();
      },
    },
    {
      id: 9,
      name: "更多",
      newIcon: "fluent:more-horizontal-16-filled",
      children: [],
    },
    {
      divider: true,
      id: 10,
    },
    {
      id: 11,
      type: "systemApp",
      newIcon: "fluent:lock-closed-16-regular",
      name: "锁定屏幕",
      event: "lock",
      fn: () => {
        this.newOpenApp(this.builtInFeatures[0]);
      },
    },
    {
      id: 15,
      type: "systemApp",
      newIcon: "fluent:settings-16-regular",
      name: "基础设置",
      event: "setting",
      fn: () => {
        this.newOpenApp(this.builtInFeatures[1]);
      },
    },
    {
      id: 20,
      type: "systemApp",
      newIcon: "fluent:full-screen-maximize-16-filled",
      name: "全屏显示",
      event: "fullscreen",
      fn: () => {
        this.newOpenApp(this.builtInFeatures[2]);
      },
    },
    {
      id: 25,
      type: "systemApp",
      newIcon: "fluent:slide-settings-24-regular",
      name: "设备设置",
      event: "status",
      fn: () => {
        this.newOpenApp(this.builtInFeatures[3]);
      },
    },
  ];
}

export default {
  computed: {
    mainMenus,
    childrenMenu() {
      return [
        {
          id: 1,
          name: this.bottomToggle[0] ? "隐藏用户中心" : "显示用户中心",
          newIcon: "fluent:person-16-regular",
          fn: () => {
            this.bottomToggle[0] = !this.bottomToggle[0];
          },
        },
        {
          id: 2,
          name: this.bottomToggle[1] ? "隐藏社区助手" : "显示社区助手",
          newIcon: "fluent:people-community-16-regular",
          fn: () => {
            this.bottomToggle[1] = !this.bottomToggle[1];
          },
        },
        {
          id: 3,
          name: this.bottomToggle[2] ? "隐藏任务中心" : "显示任务中心",
          newIcon: "fluent:task-list-square-16-regular",
          fn: () => {
            this.bottomToggle[2] = !this.bottomToggle[2];
          },
        },
      ];
    },
  },
};
