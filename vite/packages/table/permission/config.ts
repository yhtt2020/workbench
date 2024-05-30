// 权限匹配优先级
export const PRIORITY = ["web", "single","offline", "guest", "mac", "win"];
// 环境名称
export const ENV_MAP = {
  web: "网页端",
  single: "单机模式",
  mac: "mac",
  win: "win",
  offline: "离线模式",
  guest: "游客模式",
};
// 路由限制
export const ROUTER_LIMIT = {
  web: [
    "screen",
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
    "favorites"
  ],
};
// 组件限制，这里的是组件名不是列表中的name
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
    "GamesDiscount",
    "DiscountPercentage",
    "customAssembly",,
    "notes",
  ],
};
/**
 * 补充的组件添加列表内的元素名称，和组件名不统一
 */
export const COMPONENT_LIMIT_NAME={
  web:[
    "supervisory",
    'myfriends'
  ]
}
// 汇总所有限制
export const ALL_LIMITS = {
  web: [...ROUTER_LIMIT.web, ...COMPONENT_LIMIT.web],
  mac: [""],
  win: [""],
  offline: [""],
  guest: [""],
};
