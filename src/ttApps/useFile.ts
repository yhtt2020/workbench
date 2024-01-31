const { join } = require("path");
let windows: any = window;
const { fs } = windows.$models;
/**
 * 检测文件夹是否存在 不存在则创建
 *  */
export const checkDir = async (folderName: string) => {
  //
  let folderExistsRes = await folderExists(folderName);
  // 不存在则创建
  if (!folderExistsRes) {
    await folderCreate(folderName);
  }
};

/**
 * 检查工作目录下指定的文件夹是否存在
 *
 * @param folderName 要检查的文件夹名称
 * @returns 如果文件夹存在则返回 true，否则返回 false
 */
export const folderExists = async (folderName: any): Promise<boolean> => {
  let res = await fs.pathExists(pathJoin(folderName));
  return res;
};

/**
 * 创建文件夹
 * @param folderName 要创建的文件夹名称
 */
export const folderCreate = async (folderName: any) => {
  await fs.mkdirp(pathJoin(folderName));
};

/**
 * 获取当前工作目录
 * @return 返回当前工作目录
 */
export const getCurrentDir = () => {
  let fileDir = windows.globalArgs["user-data-path"];
  return fileDir;
};
export const a = () => {};

/**
 * 读取文件
 * @param fileName 要读取的文件名称
 * @param encoding 编码格式
 * @return 返回读取的文件内容
 */
export const readFile = async (fileName: string, encoding = "utf-8") => {
  let res = await fs.readFileSync(pathJoin(fileName), encoding);
  return res;
};

/**
 * 路径拼接
 */

export const pathJoin = (paths: any) => {
  if (typeof paths == "string") {
    return join(getCurrentDir(), paths);
  }
  return join(getCurrentDir(), ...paths);
};

/**
 * 删除文件
 */
export const deleteFile = async (filePath: any) => {
  let res = pathJoin(filePath);
  fs.rmdir(res, (err) => {
    if (err) throw err;
    console.log(`File ${res} has been deleted`);
  });
  // await fs.remove(pathJoin(fileName));
};
