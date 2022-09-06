const DOWNLOAD_STATUS= {
  LOADING:1,//下载中
  DONE:2,//下载完成
  DELETED:-2,//删除包括文件
  CANCEL:-1,//删除不包括文件
  BREAK:0,//下载被中断
}
module.exports={DOWNLOAD_STATUS}
