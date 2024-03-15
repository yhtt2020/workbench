/**
 * ttapp.js
 * @description 安装ttapp
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
const { nanoid } = require("nanoid");

const ttAppModel = require("./useDb.js");

const getFileExtension = (filePath) => {
  const compressedTypes = ["zip", "rar", "7z", "json"];
  const fileExtension = filePath.split(".").pop() || "";
  return compressedTypes.includes(fileExtension);
};
const tempPath = function (p) {
  return require("path").join(require("electron").app.getPath("userData"), p);
};
module.exports = async function useInstall(filePath) {
  console.log("1、开始注册ttApp :>> ");
  const id = nanoid(4);
  // 2 处理文件类型
  console.log("2、处理文件类型 :>> ");
  if (!getFileExtension(filePath)) {
    console.log("2.1、类型错误 :>> ");
    return {
      status: 1,
      code: 400,
      data: "上传的文件类型错误",
      info: "上传的文件类型错误",
    };
  }

  let folderType = "ttapp_test"; // 临时文件夹名称

  // 3 处理解压文件路径
  let folderName = [folderType, id]; // 临时文件夹名称
  // await createFolder(folderName);
  console.log("3、创建文件路径 :>> ", pathJoin(folderName));
  if (!(await existsFolder(folderName))) {
    console.log("3.1、文件夹不存在进行创建 :>> ");
    await createFolder(folderType);
  }

  // 4 //解压到临时目录
  console.log("4、解压到临时目录 :>> ");
  let unzipRes = await unzipFile(filePath, folderName);
  if (unzipRes.code !== 200) {
    console.log("4.1、解压失败 :>> ");
    return unzipRes;
  }

  // 5 判断文件是否缺少
  console.log("5、判断文件是否缺少 :>> ");
  let checkFilePath = ["manifest.json"];
  let checkFileRes = [];
  for (let path of checkFilePath) {
    let res = await existsFolder([...folderName, path]);
    if (!res) checkFileRes.push(path);
  }
  if (checkFileRes.length > 0) {
    console.log("5.1、缺少文件了 开始删除 :>> ");
    await deleteFile(folderName);
    return {
      status: 1,
      code: 400,
      data: "缺失 " + checkFileRes.join(" , ") + " 文件",
      info: "缺失 " + checkFileRes.join(" , ") + " 文件",
    };
  }
  // 6 判断manifest.json
  console.log("6、判断manifest.json文件 :>> ");
  let pathManifest = pathJoin([...folderName, "manifest.json"]);
  let manifestRes = readFile(pathManifest);
  manifestRes = JSON.parse(manifestRes);
  // 6.1、manifest.json文件不是标准的json数据
  if (typeof manifestRes !== "object") {
    console.log("6.1、manifest.json文件不是标准的json数据 :>> ");
    return {
      status: 1,
      code: 400,
      data: "manifest.json文件不是json数据",
    };
  }
  // 6.2、manifest.json文件缺少数据
  // let manifestCheck = ["page", "key", "value"];
  let manifestCheck = [];
  let manifestCheckRes = [];
  manifestCheck.forEach((key) => {
    if (manifestRes[key] == undefined) {
      manifestCheckRes.push(key);
    }
  });

  if (manifestCheckRes.length > 0) {
    console.log("6.1、manifest.json文件缺少数据 :>> ");
    await deleteFile(folderName);
    return {
      status: 1,
      code: 400,
      data: "manifest.json文件缺少 " + manifestCheckRes.join(" , ") + " 数据",
      info: "manifest.json文件缺少 " + manifestCheckRes.join(" , ") + " 数据",
    };
  }
  // 7
  let modules = {};
  for (const [key, value] of Object.entries(manifestRes.modules)) {
    modules[key] = value.entry;
  }
  console.log("7、获取modules配置 :>> ", modules);
  let modulesJson = JSON.stringify(modules);

  const ttAppData = {
    id,
    modules: modulesJson,
  };
  // 7、实现注册
  let res = await ttAppModel.initDb(ttAppData);
  console.log("7 res :>> ", res);
};
