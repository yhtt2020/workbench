import { message } from "ant-design-vue";
import { useFullscreen } from "@vueuse/core";
import { startApp } from "../../../ui/hooks/useStartApp";
import { navValidate } from "../../../apps/appCenter/src/views/developer/hooks/validate";
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
  data() {
    return {
      appsVisible: false,
    };
  },
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
      // 处理是否最后执行统一的打开函数
      let isRunApp = true;
      // 自定义定位
      let custom = false;
      // 首先处理与 type 相关的
      switch (type) {
        // 卡片类图标
        case "card":
          this.openCard(item);
          this.folderVisible = false;
          break;
        // 文件夹图标
        case "folder":
          this.openFolder(item);
          this.floatCardVisible = false;
          break;
        // 第三方应用图标
        case "ttapp":
          const res = await navValidate(item.id, item.value);
          if (!res) return;
          break;
        default:
          this.floatCardVisible = false;
          this.folderVisible = false;
      }

      // 然后处理与 value 相关的
      switch (value) {
        // 社区中心
        case "commun":
          this.comVisible = !this.comVisible;
          break;
        // 控制中心
        case "control":
          this.$emit("control", e);
          break;
        // 设置中心
        case "setting":
          this.$bus.emit("openSystemSet");
          isRunApp = false;
          break;
        // 全屏
        case "fullscreen":
          if (!window.$usePlat('client')) {
            toggle();
            return;
          }
          break;
        // 应用中心
        case "apps":
          this.appsVisible = !this.appsVisible;
          isRunApp = false;
          custom = true;
          const position = { x:600,y:632}
          this.resetElementPosition(position)
          break;
        default:
          this.appsVisible = false;
          this.comVisible = false;
          if (window.$usePlatLimit("web", value)) return;
          // 如果为桌面应用，提示
          this.msgNotice(item);
          // 主页
          if (value === "home" && item.home) {
            this.jumpDesk = item.home;
          }
      }

      if( !custom){
        // 更新定位
        this.resetElementPosition();
        this.appsVisible = false
      }

      if(!isRunApp) return
      // 统一的打开函数
      const rs = await startApp(type, value, this.$router,item);
      if (!rs) {
        message.error({
          content: `打开「${item.name}」失败`,
          key: "tipRun",
        });
      }
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
