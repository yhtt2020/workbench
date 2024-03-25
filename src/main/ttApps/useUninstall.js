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
const ttAppModel = require("./useDb.js");

module.exports = useUninstall = async (id) => {
  let folderType = "ttapp_test"; // 临时文件夹名称
  let folderName = [folderType, id]; // 临时文件夹名称

  console.log("1、删除文件 :>> ");
  let folderRes = await deleteFile(folderName);
  let sqlRes = await ttAppModel.del(id);
  console.log("folderRes :>> ", folderRes);
  console.log("sqlRes :>> ", sqlRes);
  if (folderRes && sqlRes) {
    return {
      status: 1,
      code: 200,
      data: "删除成功",
      info: "删除成功",
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
