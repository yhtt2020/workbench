// 权限匹配优先级
export const PRIORITY = ["web", "single","offline", "guest", "mac", "window"];
// 环境名称
export const ENV_MAP = {
  web: "网页端",
  mac: "mac",
  window: "window",
  offline: "离线模式",
  guest: "游客模式",
};
// 路由限制
export const ROUTER_LIMIT = {
  web: [
    "screen",
    "apps",
    "browser",
    "key",
    "myGame",
    // "dev",
    "music",
    "schemeIndex",
    "schemeList",
    "deck",
    "clipboard",
    "barrage",
    "shortcut",
    "note",
  ],
};
// 组件限制
export const COMPONENT_LIMIT = {
  web: [
    "audio",
    "voice",
    "capture",
    "CaptureNewCard",
    "CPULineChart",
    "CPUFourCard",
    "SmallCPUCard",
    "SmallGPUCard",
    "music",
    "shortcutKey",
    "MyGameSmall",
    "SteamFriends",
    "GameEpic",
    "clipBoard",
    "GameStrategy",
    "Courier",
    "GamesDiscount",
    "DiscountPercentage",
    "AggregateSearch",
    "customAssembly",
    "remote",
  ],
};
// 汇总所有限制
export const ALL_LIMITS = {
  web: [...ROUTER_LIMIT.web, ...COMPONENT_LIMIT.web],
  mac: [""],
  window: [""],
  offline: [""],
  guest: [""],
};
