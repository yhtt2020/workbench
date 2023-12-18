/**
 * 注册文件夹
 */
export const registerFolder = (desk) => {
  console.log('registerFolder :>> ', 123);
  desk.cards.push({
    id: Date.now(),
    name: "folder",
    customData: {
      title: "文件夹",
      icon: "",
      list: {},
      layout: "rows", // columns
      sort: "max",
      bg: "#508BFE",
      switch: false,
      name: "icon",
      model: "custom",
      rules: [],
    },
  });
};
