import browser from "../../../../js/common/browser";
export const startApp = (type, value) => {
  switch (type) {
    // 默认浏览器
    case "default":
      browser.openInSystem(value);
      break;
    // 嵌入浏览器
    case "internal":
      browser.openInTable(value, {});
      break;
    // 想天浏览器
    case "thinksky":
      browser.openInInner(value);
      break;
    // 轻应用
    case "lightApp":
      ipc.send("executeAppByPackage", {
        package: value,
      });
      break;
    // 酷应用
    case "coolApp":
      this.$router.push({ name: "app", params: value });
      break;
    // 本地应用
    case "tableApp":
      require("electron").shell.openPath(require("path").normalize(value));
      break;
    // 系统应用
    case "systemApp":
      this.$router.push({ name: value });
      break;
    // 不知道是什么场景
    case "localApp":
      require("electron").shell.openPath(value);
      break;
  }
};
