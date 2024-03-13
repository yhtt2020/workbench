/**
 * ttapp.js
 * @description 卸载ttapp
 */
const {
  existsFolder,
  createFolder,
  unzipFile,
  readFile,
  deleteFile,
  pathJoin,
  getCurrentDir,
} = require("./useFile.js");
const ttAppModel = require("../../model/ttAppModel.js");

module.exports = useUninstall = async (id) => {
  console.log("拿到id :>> ", id);
  // 1、检查是否存在
  console.log("1、检查是否存在 :>> ");
  let folderType = "ttapp_test"; // 临时文件夹名称
  let folderName = [folderType, id]; // 临时文件夹名称
  // if (!(await existsFolder(folderName))) {
  //   return {
  //     status: 1,
  //     code: 200,
  //     data: "已删除",
  //     info: "已删除",
  //   };
  // }

  // 2、删除文件
  console.log("2、删除文件 :>> ");
  await deleteFile(["ttapp_test", id]);
  let delSqlRes =await ttAppModel.del(id);
  console.log("delSqlRes :>> ", delSqlRes);
  if (!(await existsFolder(folderName))) {
    return {
      status: 1,
      code: 200,
      data: "已删除",
      info: "已删除",
    };
  } else {
    return {
      status: 0,
      code: 400,
      data: "删除失败",
      info: "删除失败",
    };
  }
};
