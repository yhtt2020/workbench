import browser from "../../../../js/common/browser";
export const openBrowser = (url: string, type: string) => {
  console.log("type :>> ", type);
  if (type === "default") {
    browser.openInTable(url, {});
  } else if (type === "thisky") {
    browser.openInInner(url);
  } else if (type === "system") {
    browser.openInSystem(url);
  }
};
