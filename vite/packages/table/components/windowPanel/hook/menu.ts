function iconMenus() {
  return [
    {
      id: 1,
      newIcon: "fluent:open-16-regular",
      label: "打开",
      callBack: () => {
        this.newOpenApp(this.currentItem);
      },
    },
    {
      id: 2,
      label: "编辑",
      newIcon: "fluent:compose-16-regular",
      callBack: () => {
        this.editIcon(this.currentItem);
      },
    },
    {
      id: 3,
      label: "删除",
      newIcon: "fluent:delete-16-regular",
      color: "#FF4D4F",
      callBack: () => {
        this.deleteIcon(this.currentItem, this.sortId);
      },
    },
    {
      id: 5,
      divider: true,
    },
    {
      id: 6,
      label: "添加导航图标",
      newIcon: "fluent:add-16-regular",
      callBack: () => {
        this.editNavigation(this.drawerMenus[0]);
      },
    },
    {
      id: 7,
      label: "导航栏设置",
      newIcon: "fluent:settings-16-regular",
      callBack: () => {
        this.$bus.emit("openSystemSet");
        setTimeout(() => {
          this.$bus.emit("selectSystemNav", 3);
        }, 10);
      },
    },
  ];
}

export default {
  computed: {
    iconMenus,
    resize() {
      const length = this.folderList.length;
      if (length <= 6) {
        return "2x2";
      } else if (length <= 12 && length > 6) {
        return "3x3";
      } else if (length <= 18 && length > 12) {
        return "4x4";
      } else {
        return "6x4";
      }
    },

  },
};
