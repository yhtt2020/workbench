const path=require('path')
export function getLogo(logo,local_dir,fileProtocol=true){
  if(logo==='local'){
    return  (fileProtocol?'file://':'')+ path.join(local_dir,'logo.png')
  }else{
    return logo
  }
}

export function getBgColorFromEntry(entry){
  let color='black'
  if(entry){
    color= entry.bgColor
  }
  return color
}

export const myStore={
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }, /**
   * 读入一个app的数据
   * @param $app
   */
  loadAppData($app,defaultValue){
    let saved=localStorage.getItem('appData.'+$app)
    if(saved) {
      let data= JSON.parse(saved)
      return data
    }else{
      return defaultValue
    }
  },
  /**
   * 读入全部的设置
   */
  loadSettings(defaultValue){
    let saved=localStorage.getItem('settings')
    if(saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.warn('应用设置载入错误，自动使用默认值')
      }
    }
    return defaultValue
  }
}
