export const menu = {
  title: "选择图标类型",
  info: "你可以从以下图标资源中进行选择",
  list: [
    ...($usePlat('client')?[
      {
        newIcon: "mingcute:windows-line",
        name: "Windows桌面图标",
        component:"Windows"
      },
      {
        newIcon: "fluent:window-multiple-16-regular",
        name: "轻应用",
        component:"LightApp"
      },
      {
        newIcon: "fluent:star-16-regular",
        name: "浏览器收藏夹",
        component:"Browser"
      },
    ]:[]),
    {
      newIcon: "fluent:settings-16-regular",
      name: "系统应用和功能",
      component:"System"
    },
    {
      newIcon: "fluent:globe-16-regular",
      name: "网址导航",
      component:"WebSite"
    },

    {
      newIcon: "fluent:grid-16-regular",
      name: "酷应用",
      component:"CoolApp"
    },
    {
      name: "自定义图标",
      newIcon: "fluent:add-16-regular",
      component:"CustomIcon"
    },
  ],
};

export const teamMenu = {
  title: "团队资源（开发中）",
  info: "由你的社群团队创建的资源",
  list: [
    {
      name: "团队导航",
      newIcon: "fluent:people-community-16-regular",
      component:"Team"
    },
    {
      name: "团队软件库",
      newIcon: "fluent:hard-drive-16-regular",
      component:"Team"
    },
  ],
};
