import { message } from "ant-design-vue";
import { useFullscreen } from "@vueuse/core";
import { startApp } from "../../../ui/hooks/useStartApp";
const { isFullscreen, toggle } = useFullscreen();
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
        this.editNav(this.currentItem);
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
        this.editNav(this.drawerMenus[0]);
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
  methods: {
    /**
     * 打开桌面应用提示
     * @param {*} item 当前图标
     */
    msgNotice(item) {
      if (item.type === "tableApp") {
        message.loading({
          content: `打开「${item.name}」...`,
          key: "tipRun",
        });
      }
    },
    /**
     * 打开应用
     * @param {*} item 图标详细信息
     */
    async newOpenApp(item, e) {
      const { type, value } = item;
      if (type === "card") {
        this.openCard(item);
      }
      if (type !== "card") {
        this.floatCardVisible = false;
      }
      if (type !== "folder") {
        this.folderVisible = false;
      }
      if (value !== "commun") {
        this.comVisible = false;
      }
      // 更新鼠标定位
      this.resetElementPosition();
      if (value === "control") {
        this.$emit("control", e);
        return;
      }
      if (value === "setting") {
        this.$bus.emit("openSystemSet");
        return;
      }
      if (value === "commun") {
        this.comVisible = !this.comVisible;
        return;
      }
      if (type === "folder") {
        this.openFolder(item);
      }
      if (value == "fullscreen" && window.$useEnv()) {
        toggle();
        return;
      }
      if (window.$useEnvLimit("web", value)) return;

      this.msgNotice(item);
      if (value === "home" && item.home) {
        this.jumpDesk = item.home;
      }
      let rs = await startApp(type, value, this.$router);
      if (!rs) {
        message.error({
          content: `打开「${item.name}」失败`,
          key: "tipRun",
        });
      }
      this.comVisible = false;
    },
    /**
     * 当前选中的元素
     * @param item 元素
     * @param index 索引
     */
    showElement(item, index) {
      this.currentItem = item;
      this.currentIndex = index;
    },
  },
};
