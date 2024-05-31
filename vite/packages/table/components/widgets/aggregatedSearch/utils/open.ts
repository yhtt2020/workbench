import { useAppModal } from "../../../../hooks";
import browser from "../../../../js/common/browser";
import { startApp } from "../../../../ui/hooks/useStartApp";
import { useGroupJump } from "../../../../hooks/src/useGroupRedirect";
export const openBrowser = (type: string, url: string) => {
  if (type === "default") {
    browser.openInTable(url, {});
  } else if (type === "thisky") {
    browser.openInInner(url);
  } else if (type === "system") {
    browser.openInSystem(url);
  }
};

export const open = (item) => {
  let showType = item.showType;
  if (!showType) {
    return;
  }
  if (showType === "网页") {
    openBrowser(item.openWith, item.value);
  } else if (showType === "应用") {
    startApp(item.openWith, item.value);
  } else if (showType === "备忘录") {
    useAppModal("note").openApp(item.value);
  } else if (showType === "群聊") {
    useGroupJump(item.value);
  }
};
