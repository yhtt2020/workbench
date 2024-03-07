const {
  existsFolder,
  createFolder,
  unzipFile,
  readFile,
  deleteFile,
  pathJoin,
  getCurrentDir,
} = require("./useFile.js");
const { join } = require("path");

const fs = require("fs-extra");
const ttAppModel = require("../../model/ttAppModel.js");

const getFileExtension = (filePath) => {
  const compressedTypes = ["zip", "rar", "7z", "json"];
  const fileExtension = filePath.split(".").pop() || "";
  return compressedTypes.includes(fileExtension);
};
const tempPath = function (p) {
  return require("path").join(require("electron").app.getPath("userData"), p);
};
module.exports = async function useRegisterTTApps(filePath) {
  console.log("1、开始注册ttApp :>> ");

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
  // ttAppModel.initDb();
  let folderType = "ttapp_test"; // 临时文件夹名称

  // 3 处理解压文件路径
  let folderName = [folderType, String(Date.now())]; // 临时文件夹名称
  // await createFolder(folderName);
  console.log("3、创建好的文件路径 :>> ", pathJoin(folderName));
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
    let res = await existsFolder(folderName);
    if (!res) checkFileRes.push(path);
  }
  if (checkFileRes.length > 0) {
    console.log("5.1、缺少文件了 开始删除 :>> ");
    // 删除会报错
    await deleteFile(pathJoin(folderName));
    return {
      status: 1,
      code: 400,
      data: "缺失 " + checkFileRes.join(" , ") + " 文件",
      info: "缺失 " + checkFileRes.join(" , ") + " 文件",
    };
  }
  // 6 判断manifest.json
  let pathManifest = pathJoin([temporaryFolderName, "manifest.json"]);
  if (!existsFolder(pathManifest)) {
    return {
      status: 0,
      info: "manifest.json文件不存在",
    };
  }
  let manifestRes = readFile(pathManifest);
  try {
    manifestRes = JSON.parse(manifestRes);
    console.log("manifest.json 正常转义为对象了 :>> ");
  } catch (e) {
    return {
      status: 0,
      info: "manifest.json文件不是标准的json数据",
    };
  }

  if (typeof manifestRes !== "object") {
    return {
      status: 1,
      code: 400,
      data: "manifest.json文件不是json数据",
    };
  }
  let manifestCheck = ["page", "key", "value"];
  let manifestCheckRes = [];
  manifestCheck.forEach((key) => {
    if (manifestRes[key] == undefined) {
      manifestCheckRes.push(key);
    }
  });

  if (manifestCheckRes.length > 0) {
    await deleteFile(temporaryFolderName);
    return {
      status: 1,
      code: 400,
      data: "manifest.json文件缺少 " + manifestCheckRes.join(" , ") + " 数据",
      info: "manifest.json文件缺少 " + manifestCheckRes.join(" , ") + " 数据",
    };
  }
};
