/**
 * ttapp.js
 * @description 处理文件相关操作
 */
// const extractZip = require("../../../js/main/crx");
const extractZip = require("../../../js/main/zip.js");
const { join } = require("path");
const { promises } = require("fs");
const fs = require("fs-extra");

const fse = require("fs-extra");
const electron = require("electron");

const file = {
  /**
   * 检测文件夹是否存在 不存在则创建
   */
  async checkDir(folderName) {
    //
    let folderExistsRes = await file.existsFolder(folderName);
    // 不存在则创建
    if (!folderExistsRes) {
      await file.createFolder(folderName);
    }
  },
  /**
   * 检查工作目录下指定的文件夹是否存在
   *
   * @param folderName 要检查的文件夹名称
   * @returns 如果文件夹存在则返回 true，否则返回 false
   */
  async existsFolder(folderName) {
    let fileDir = file.pathJoin(folderName);
    let res = await fs.pathExists(fileDir);
    return res;
  },
  /**
   * 创建文件夹
   * @param folderName 要创建的文件夹名称
   */
  async createFolder(folderName) {
    await fs.mkdirp(file.pathJoin(folderName));
  },
  /**
   * 获取当前工作目录
   * @return 返回当前工作目录
   */
  getCurrentDir(paths = [""]) {
    let fileDir = electron.app.getPath("userData");
    //  globalArgs["user-data-path"];
    return fileDir;
  },
  /**
   * 读取文件
   * @param fileName 要读取的文件名称
   * @param encoding 编码格式
   * @return string
   */
  readFile(fileName, encoding = "utf-8") {
    return fs.readFileSync(fileName, {
      encoding: encoding,
    });
  },
  /**
   * 删除文件
   */
  async deleteFile(filePath) {
    try {
     await fse.removeSync(file.pathJoin(filePath));
      return true;
    } catch (err) {
      console.error("Error deleting directory:", err);
      return false;
    }
  },
  /**
   * 文件解压
   */
  async unzipFile(filePath, destPath) {
    destPath = file.pathJoin(destPath);
    try {
      const zipBuf = await promises.readFile(filePath);
      // const crxInfo = parseCrx(crxBuf);
      let res = await extractZip(zipBuf, destPath);
      return {
        status: 1,
        code: 200,
        data: "success",
        info: "成功",
      };
    } catch (error) {
      return {
        status: 0,
        code: 400,
        info: "文件无法解压",
        data: error,
      };
    }
  },
  /**
   * 路径拼接
   */
  pathJoin(paths) {
    if (typeof paths == "string") {
      return join(file.getCurrentDir(), paths);
    }
    return join(file.getCurrentDir(), ...paths);
  },
};

/**
 * 路径拼接
 */
function pathJoin(paths) {
  if (typeof paths == "string") {
    return join(file.getCurrentDir(), paths);
  }
  return join(file.getCurrentDir(), ...paths);
}
module.exports = file;
