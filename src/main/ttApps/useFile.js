/**
 * 处理文件相关操作 ttapp.js
 * @description 处理文件相关操作
 */
// const extractZip = require("../../../js/main/crx");
const extractZip = require("../../../js/main/zip.js");
const { join } = require("path");
const { promises } = require("fs");
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
    try {
      let fileDir = file.pathJoin(folderName);
      let res = await fse.pathExists(fileDir);
      return res;
    } catch (error) {
      return false;
    }
  },
  /**
   * 创建文件夹
   * @param folderName 要创建的文件夹名称
   */
  async createFolder(folderName) {
    await fse.mkdirp(file.pathJoin(folderName));
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
  async readFile(fileName, encoding = "utf-8") {
    let folderExistsRes = await file.existsFolder(fileName);
    if (!folderExistsRes) {
      return {
        status: 0,
        code: 400,
        info: "文件不存在",
        data: "文件不存在",
      };
    }
    try {
      let res = await fse.readFileSync(file.pathJoin(fileName), {
        encoding: encoding,
      });
      return {
        code: 200,
        data: res,
      };
    } catch (err) {
      console.error("Error deleting directory:", err);
      return {
        status: 0,
        code: 400,
        info: "读取失败",
        data: err,
      };
    }
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
        code: 200,
        data: res,
      };
    } catch (error) {
      return error;
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
  /**
   * 写入文件
   */
  async writeFile(filePath, data) {
    try {
      let res = fse.writeFileSync(file.pathJoin(filePath), data);
      return {
        code: 200,
        data: res,
      };
    } catch (err) {
      return {
        status: 0,
        code: 400,
        info: "写入失败",
        data: err,
      };
    }
  },
  /**
   * 移动文件夹
   */
  async moveFolder(source, dest) {
    try {
      console.log("----------------------------);:>> ");
      console.log("file.pathJoin(source) :>> ", file.pathJoin(source));
      console.log("file.pathJoin(dest) :>> ", file.pathJoin(dest));
      console.log("----------------------------);:>> ");
      await fse.move(file.pathJoin(source), file.pathJoin(dest), {
        overwrite: true,
      });
      return true;
    } catch (err) {
      console.error("Error moving folder:", err);
      return false;
    }
  },
  /**
   * 复制文件夹 没生效
   */
  async copyFolder(source, dest) {
    try {
      console.log("file.pathJoin(source) :>> ", file.pathJoin(source));
      console.log("file.pathJoin(dest) :>> ", file.pathJoin(dest));
      fse.copySync(file.pathJoin(source), file.pathJoin(dest), {
        overwrite: true,
      });
      console.log("Folder copied successfully!");
      return true;
    } catch (error) {
      console.error("Error copying folder:", error);
      return false;
    }
  },
};

module.exports = file;
