/**
 * ttapp.js
 * @description 查询ttapp数据
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

const useSelect = async (id) => {
  console.log("拿到id :>> ", id);
  let res = await ttAppModel.select(id);
  console.log("res :>> ", res);
  console.log("res.length :>> ", res.length);
  if (res.length) {
    return {
      status: 0,
      code: 200,
      data: res[0],
      info: "获取成功",
    };
  }
  return {
    status: 1,
    code: 400,
    data: "获取失败",
    info: "获取失败",
  };
};
const useSelectAll = async () => {
  let res = await ttAppModel.selectAll();

  return {
    status: 0,
    code: 200,
    data: res,
    info: "获取成功",
  };
};

module.exports = {
  useSelect,
  useSelectAll,
};
