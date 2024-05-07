/**
 * 安装ttapp ttapp.js
 * @description 安装ttapp
 */
// 辅助函数
const {
  existsFolder,
  unzipFile,
  deleteFile,
  writeFile,
  moveFolder,
  readFile,
  checkDir,
} = require("../useFile.js");
// 生成唯一id 贯穿整个安装流程
const { nanoid } = require("nanoid");
// 数据库操作
const ttAppModel = require("../useDb.js");
const ERROR_CODE = require("./constant.js");
const checkMainFest = require("./check.js");

// 当前id
let currentId = "";
// 获取文件类型
const getFileExtension = (filePath) => {
  const compressedTypes = ["zip", "rar", "7z"];
  const fileExtension = filePath.split(".").pop() || "";
  return compressedTypes.includes(fileExtension);
};
// 自定义校验文件是否存在
const checkFile = async (filePath) => {
  const folderType = "apps_test";
  const folderName = [folderType, currentId, filePath];
  let res = await existsFolder(folderName);
  return res;
};

// 从测试文件夹复制到正式文件夹
const useMoveFolder = async () => {
  await checkDir(["apps", currentId]);
  let res = await moveFolder(["apps_test", currentId], ["apps", currentId]);
  return res;
};

// 保存数据
const saveData = async (options) => {
  let installDbRes = await ttAppModel.insert(options);

  if (installDbRes) {
    return {
      status: 0,
      code: 200,
      data: currentId,
      info: "成功",
    };
  } else {
    return {
      status: 1,
      code: 400,
      data: currentId,
      info: "数据保存失败",
    };
  }
};
/** 解压文件 */
const unzip = async (filePath) => {
  // 1 判断文件类型
  if (!getFileExtension(filePath)) {
    console.log("1、文件类型错误 :>> ");
    return {
      status: 1,
      code: 1,
      data: "上传的文件类型错误",
      info: ERROR_CODE[1],
    };
  }

  // 2 处理解压文件路径
  const folderType = "apps_test";
  const folderName = [folderType, currentId];
  await checkDir(folderName);

  // 3 解压到临时目录
  let unzipRes = await unzipFile(filePath, folderName);
  if (unzipRes.code !== 200) {
    console.log("3、解压失败 :>> ");
    return {
      status: 0,
      code: 2,
      info: ERROR_CODE[2],
      data: unzipRes,
    };
  }

  console.log("成功完成解压 :>> ");
  return unzipRes;
};
/**
 * 安装ttapp v2
 * 负责解压文件
 */
const installV2 = async (options) => {
  let { id, path } = options;
  let renew = false;
  if (options.id) {
    renew = true;
  } else {
    id = nanoid(4);
  }
  currentId = id;
  console.log("开始注册ttApp :>> ");
  let unzipRes = await unzip(path);
  if (unzipRes.code !== 200) {
    return unzipRes;
  }
  return await checkV2(renew);
};
/**
 * 检测v2
 * 负责检测manifest.json 和最后的处理
 */
const checkV2 = async (flag) => {
  // 4 检测manifest.json
  const checkManifestRes = await checkMainFest(currentId);
  // 
  if (checkManifestRes.code !== 200) {
    return {
      id: currentId,
      ...checkManifestRes,
    };
  }
  // 5 移动文件夹
  const moveRes = await useMoveFolder();
  if (!moveRes) {
    return {
      status: 1,
      code: 400,
      data: "文件丢失请重试",
      info: "文件丢失请重试",
    };
  }

  // 6 保存数据
  // 过滤不需要的数据
  // manifestRes
  const { data } = checkManifestRes;
  const obj = {
    id: currentId,
    ...data,
  };
  console.log("flag :>> ", flag);
  if (!flag) {
    const saveRes = await saveData({
      id: currentId,
      data: obj,
    });
    if (saveRes.code !== 200) return saveRes;
  }
  console.log("installV2 流程已走完 :>> ");
  return {
    code: 200,
    data: obj,
  };
};
// 安装json
const installJson = async (data) => {
  const folderType = "apps_test"; // 临时文件夹名称
  const folderName = [folderType, currentId, "manifest.json"];
  let writeRes = await writeFile(folderName, data);

  if (writeRes.code !== 200) {
    return {
      ...writeRes,
      code: 41,
      info: ERROR_CODE[41],
    };
  }
  let res = await checkV2(currentId);
  return res;
};
module.exports = {
  installV2,
};
