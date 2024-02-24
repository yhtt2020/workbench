const {
  existsFolder,
  createFolder,
  unzipFile,
  readFile,
  deleteFile,
} = require("./useFile.js");

const getFileExtension = (filePath) => {
  const compressedTypes = ["zip", "rar", "7z", "json"];
  const fileExtension = filePath.split(".").pop() || "";
  return compressedTypes.includes(fileExtension);
};

module.exports = async function useRegisterTTApps(filePath) {
  console.log("3333 :>> ", 3333);
  // // 1 获取文件
  // let path = await tsbApi.dialog.showOpenDialog({
  //   title: "选择",
  //   message: "请选择文件",
  //   multiple: "true",
  //   properties: ["openFile", "multiSelections"],
  // });
  // if (!path) return;

  // 2 处理文件类型
  if (!getFileExtension(filePath)) {
    return {
      status: 1,
      code: 400,
      data: "上传的文件类型错误",
      info: "上传的文件类型错误",
    };
  }

  // 3 处理文件路径
  let temporaryFolderName = ["ttapp_test", "" + Date.now()]; // 临时文件夹名称
  if (!(await existsFolder(temporaryFolderName))) {
    await createFolder(temporaryFolderName);
  }

  // 4 //解压到临时目录
  let unzipRes = await unzipFile(filePath, temporaryFolderName);
  if (unzipRes.code !== 200) {
    return unzipRes;
  }

  // 5 判断文件是否缺少
  let checkFilePath = ["manifest.json"];
  let checkFileRes = [];
  for (let path of checkFilePath) {
    let res = await folderExists([...temporaryFolderName, path]);
    if (!res) checkFileRes.push(path);
  }
  if (checkFileRes.length > 0) {
    deleteFile(temporaryFolderName);
    return {
      status: 1,
      code: 400,
      data: "缺失 " + checkFileRes.join(" , ") + " 文件",
      info: "缺失 " + checkFileRes.join(" , ") + " 文件",
    };
  }

  // 6 判断manifest.json
  let manifestRes = await readFile([...temporaryFolderName, "manifest.json"]);
  manifestRes = JSON.parse(manifestRes);
  if (typeof manifestRes !== "object") {
    return {
      status: 1,
      code: 400,
      data: "manifest.json文件不是json数据",
      info: "manifest.json文件不是json数据",
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
    deleteFile(temporaryFolderName);
    return {
      status: 1,
      code: 400,
      data: "manifest.json文件缺少 " + manifestCheckRes.join(" , ") + " 数据",
      info: "manifest.json文件缺少 " + manifestCheckRes.join(" , ") + " 数据",
    };
  }
};
