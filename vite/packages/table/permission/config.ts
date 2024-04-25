// 权限匹配优先级
export const PRIORITY = ["h5", "single","offline", "guest", "mac", "window"];
// 环境名称
export const ENV_MAP = {
  h5: "网页端",
  single: "单机模式",
  mac: "mac",
  window: "window",
  offline: "离线模式",
  guest: "游客模式",
};
// 路由限制
export const ROUTER_LIMIT = {
  h5: [
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
  h5: [
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
  h5: [...ROUTER_LIMIT.h5, ...COMPONENT_LIMIT.h5],
  mac: [""],
  window: [""],
  offline: [""],
  guest: [""],
};
