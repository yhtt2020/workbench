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
