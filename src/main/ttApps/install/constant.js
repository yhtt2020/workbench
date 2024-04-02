// 错误编码 方便前端做判断 预留10位做扩展
const ERROR_CODE = {
  // 文件操作
  1: "文件类型错误",
  2: "文件解压失败",
  // manifest.json 相关
  21: "manifest.json文件不存在",
  22: "manifest.json文件不是合格的数据",
  22: "manifest.json文件缺少数据",
  23: "manifest.json文件缺少指定文件",
  // 数据库相关
  41: "文件写入失败",
};
module.exports = ERROR_CODE;
