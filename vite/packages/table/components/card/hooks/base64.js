const { fs } = window.$models;
import { myIcons } from "../../../store/myIcons";

import { SHA256 } from "crypto-js";
const { join } = require("path");
const dataURLToBlob = (fileDataURL) => {
  let arr = fileDataURL.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};
const saveFile = async (filePath, file) => {
  try {
    await fs.writeFile(filePath, file); // 写入文件
    // console.log(`文件成功保存在 : ${filePath}`);
  } catch (err) {
    // console.error(`Error saving file: ${err}`);
  }
};
const saveBase64AsImage = async (filePath, base64) => {
  let file = Buffer.from(await dataURLToBlob(base64).arrayBuffer());
  let fileDir = await getFileDir();
  try {
    let exists = await fs.pathExists(fileDir);
    if (exists) {
      // console.log("文件夹存在 :>> ");
      await saveFile(filePath, file);
    } else {
      // console.log("创建文件夹 :>> ");
      await fs.mkdirp(fileDir);
      await saveFile(filePath, file);
    }
  } catch (err) {
    console.error(`Error saving file: ${err}`);
  }
};

// 用户路径拼接
const getFileDir = () => {
  let fileDir = window.globalArgs["user-data-path"];
  fileDir = join(fileDir, "temporaryIcon");

  return fileDir;
};
export const useBase64AsImage = async (base64) => {
  let fileDir = await getFileDir();
  let name = Date.now() + ".png";
  const fileSavePath = join(fileDir, name);
  let fileUsePath = join("file://", fileDir, name);
  // 匹配
  let sha256Hash = SHA256(base64).toString();
  const store = myIcons();
  const temporaryIcon = store.temporaryIcon;
  if (temporaryIcon.length != 0) {
    let file = temporaryIcon.find((item) => {
      return item.hash == sha256Hash;
    });
    if (file) return file.src;
  }
  let file = {
    hash: sha256Hash,
    src: fileUsePath,
  };
  temporaryIcon.push(file);
  await saveBase64AsImage(fileSavePath, base64);
  return fileUsePath;
};
