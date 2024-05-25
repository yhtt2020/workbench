import { usePlat } from "../../../../../permission/usePlat";

export const checkStatus = () => {
  if (usePlat("web")) {
    window.$ui.confirm("web端暂不支持此功能", "请前往客户端体验完整功能", {
      noText: "稍后再说",
      okText: "立即前往",
      ok: () => {
        window.open("https://www.apps.vip/download/");
      },
      okButtonWidth: "95",
      noButtonWidth: "95",
    });
    return false;
  }
};
