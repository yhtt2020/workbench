/**
 * 注册文件夹
 */
export const registerFolder = (desk) => {
  desk.cards.push({
    id: Date.now(),
    name: "folder",
    customData: {
      title: "文件夹",
      icon: "",
      list: {},
      layout: "rows", // columns
      sort: "useCount",
      bg: "#508BFE",
      switch: false,
      name: "icon",
      model: "custom",
      rules: [],
    },
  });
};
