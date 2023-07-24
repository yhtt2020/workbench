const { fs } = window.$models;
import { myIcons } from "../../../../../store/myIcons";

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
    console.log(`文件成功保存在 : ${filePath}`);
  } catch (err) {
    console.error(`Error saving file: ${err}`);
  }
};
const saveBase64AsImage = async (filePath, base64) => {
  let file = Buffer.from(await dataURLToBlob(base64).arrayBuffer());
  let fileDir = fileDir();
  fs.pathExists(fileDir, (err, exists) => {
    if (exists) {
      saveFile(filePath, file);
    } else {
      fs.mkdirp(fileDir, (err) => {
        if (err) throw err;
        console.log("文件夹创建成功 :>> ");
        saveFile(filePath, file);
      });
    }
  });
};

// 用户路径拼接
// const fileDirs = () => {
//   // console.log("object :>> ", window.globalArgs);
//   let fileDir = window.globalArgs["app-dir_name"];
//   fileDir = fileDir.replace(/\\src\\main/, "");
//   fileDir = join(fileDir, "vite", "temporaryIcon");
//   console.log("2222 :>> ", 2222);
//   return fileDir;
// };

// 主入口
export const useBase64AsImage = async (base64) => {
  let filePath = window.globalArgs["app-dir_name"];
  filePath = filePath.replace(/\\src\\main/, "");
  filePath = join(filePath, "vite", "temporaryIcon");
  let name = Date.now() + ".png";
  const fileSavePath = join(filePath, name);
  let fileUsePath = "../../../../../../temporaryIcon/" + name;
  console.log("fileUsePath :>> ", fileUsePath);
  // // 拿到哈希去匹配
  // let sha256Hash = SHA256(base64).toString();
  // const store = myIcons();
  // const temporaryIcon = store.temporaryIcon;

  // if (temporaryIcon.length != 0) {
  //   let file = temporaryIcon.find((item) => {
  //     return item.hash == sha256Hash;
  //   });
  //   if (file) return file.src;
  // }
  // let file = {
  //   hash: sha256Hash,
  //   src: fileUsePath,
  // };
  // temporaryIcon.push(file);
  await saveBase64AsImage(fileSavePath, base64);
  return fileUsePath;
};
