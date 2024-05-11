export const getAppImg =  (id: string, path: string) => {
  const { join } = require("path");
  let dataPath = window?.globalArgs["user-data-path"];
  let imgPath = join(dataPath, "apps", id, path);
  console.log('imgPath :>> ', imgPath);
  return imgPath;
};
