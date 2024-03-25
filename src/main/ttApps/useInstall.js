/**
 * 安装ttapp ttapp.js
 * @description 安装ttapp
 */
const {
  existsFolder,
  createFolder,
  unzipFile,
  deleteFile,
  writeFile,
  moveFolder,
  readFile,
  checkDir,
} = require("./useFile.js");

const fse = require("fs-extra");
const ERROR_CODE = {
  11: "文件类型错误",
  12: "文件解压失败",
  21: "manifest.json文件不存在",
  22: "manifest.json文件不是合格的数据",
  22: "manifest.json文件缺少数据",
  31: "文件写入失败",
};
const { nanoid } = require("nanoid");

const ttAppModel = require("./useDb.js");

let currentId = "";

// 检测manifest.json
const checkMainFest = async (id) => {
  let manifestPath = ["apps_test", id, "manifest.json"];
  let manifestRes = await readFile(manifestPath);

  // 检测manifest.json文件是否存在
  if (manifestRes.code !== 200) {
    return {
      status: 1,
      code: 21,
      data: "manifest.json文件不存在",
      info: ERROR_CODE[21],
      id,
    };
  }

  // 检测manifest.json是否为json
  manifestRes = JSON.parse(manifestRes.data);
  if (typeof manifestRes !== "object") {
    return {
      status: 1,
      code: 22,
      data: ERROR_CODE[22],
      id,
    };
  }
  // 检测manifest.json数据
  let manifestCheck = ["name", "modules"];
  let manifestCheckRes = [];
  manifestCheck.forEach((key) => {
    if (manifestRes[key] == undefined) {
      manifestCheckRes.push(key);
    }
  });
  if (manifestCheckRes.length > 0) {
    return {
      status: 1,
      code: 23,
      data: "manifest.json文件缺少 " + manifestCheckRes.join(" , ") + " 数据",
      info: "manifest.json文件缺少 " + manifestCheckRes.join(" , ") + " 数据",
    };
  }
  return {
    status: 0,
    code: 200,
    data: manifestRes,
    info: "成功",
  };
};
// 获取文件类型
const getFileExtension = (filePath) => {
  const compressedTypes = ["zip", "rar", "7z", "json"];
  const fileExtension = filePath.split(".").pop() || "";
  return compressedTypes.includes(fileExtension);
};
// 从测试文件夹复制到正式文件夹
const useMoveFolder = async (id) => {
  await checkDir(["apps", id]);
  let res = await moveFolder(["apps_test", id], ["apps", id]);
  return res;
};

// 保存数据
const saveData = async (options) => {
  let installDbRes = await ttAppModel.insert(options);
  if (installDbRes) return true;
};

/**
 * 安装ttapp v2
 */
const installV2 = async (filePath) => {
  console.log("开始注册ttApp :>> ");
  // 1 判断文件类型
  if (!getFileExtension(filePath)) {
    console.log("1、文件类型错误 :>> ");
    return {
      status: 1,
      code: 11,
      data: "上传的文件类型错误",
      info: ERROR_CODE[11],
    };
  }

  // 2 处理解压文件路径
  const id = nanoid(4);
  currentId = id;
  console.log("抛出的 id :>> ", id);
  const folderType = "apps_test";
  const folderName = [folderType, id];
  await checkDir(folderName);

  // 3 解压到临时目录
  let unzipRes = await unzipFile(filePath, folderName);
  if (unzipRes.code !== 200) {
    console.log("3、解压失败 :>> ");
    return {
      status: 0,
      code: 12,
      info: ERROR_CODE[12],
      data: unzipRes,
    };
  }

  let res = await checkV2(id);
  return res;
};
const checkV2 = async (id) => {
  // 4 检测manifest.json
  const checkManifestRes = await checkMainFest(id);
  if (checkManifestRes.code !== 200) {
    return {
      id,
      ...checkManifestRes,
    };
  }

  // 5 移动文件夹
  const moveRes = await useMoveFolder(id);
  if (!moveRes) {
    return {
      status: 1,
      code: 400,
      data: "文件丢失请重试",
      info: "文件丢失请重试",
    };
  }

  // 6 保存数据
  const saveRes = await saveData({
    id,
    modules: checkManifestRes.data.modules,
  });
  if (saveRes) {
    return {
      status: 0,
      code: 200,
      data: id,
      info: "成功",
    };
  } else {
    return {
      status: 1,
      code: 400,
      data: "数据保存失败",
      info: "数据保存失败",
    };
  }
};
const installJson = async (data) => {
  const folderType = "apps_test"; // 临时文件夹名称
  const folderName = [folderType, currentId, "manifest.json"];
  let writeRes = await writeFile(folderName, data);

  console.log("writeRes :>> ", writeRes);
  if (writeRes.code !== 200) {
    return {
      ...writeRes,
      code: 31,
      info: ERROR_CODE[31],
    };
  }
  let res = await checkV2(currentId);
  console.log("res :>> ", res);
  return res;
};
const useInstall = async (filePath) => {
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
  // // 6 判断manifest.json
  // console.log("6、判断manifest.json文件 :>> ");
  // let pathManifest = pathJoin([...folderName, "manifest.json"]);

  // 7
  // let modules = {};
  // console.log("7、获取modules配置 :>> ", modules);
  // let modulesJson = JSON.stringify(manifestRes.modules);

  // if (res) {
  return id;
  // } else {
  //   return false;
  // }
};

module.exports = {
  useInstall,
  installJson,
  installV2,
};
