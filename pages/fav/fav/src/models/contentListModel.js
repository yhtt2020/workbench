import tools from '@/utils/tools'
tools.getWindowArgs(window)
const fs = eval('require')('fs')
const contentListModel = {
  loadLocalStoreContents (dir) {
    let files = fs.readdirSync(dir)
    let filesInfo=[]
    files.forEach(file=>{
      filesInfo.push({
        path:dir,
        filename:file,
        stat:fs.statSync(dir+file)
      })
    })
    return filesInfo
  }
}

export default contentListModel
