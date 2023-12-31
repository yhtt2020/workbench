localSpaceModel=require('../../model/localSpaceModel')
if(window){
  ldb=window.ldb
}
const localAdapter={
  name:'localAdapter',
  oldSavePath: window.globalArgs['user-data-path'] + (platformType === 'windows' ? '\\sessionRestore.json' : '/sessionRestore.json'),
  previousState: null,
  adapter:null,

  save(space,saveData){
    localSpaceModel.save(space,saveData)
  },
  update(space){
    localSpaceModel.update(space)
  },
  /**
   * 从本地读入老的空间存储
   * @returns {boolean|*}
   */
  loadOldRestore(){
    if(fs.existsSync(localAdapter.oldSavePath)){
      let savedJson=fs.readFileSync(localAdapter.oldSavePath, 'utf-8')
      if(savedJson){
        //fs.renameSync(localAdapter.oldSavePath,localAdapter.oldSavePath+'.bak')
        return savedJson
      }
    }else{
      return false
    }
  },
  async restore(spaceId){
    var savedStringData
    try {
      let space= await localSpaceModel.getSpace(spaceId)
      if(!!!space){
        //一般这条路径也走不到的，会被前面的初始化查询处理掉。
        savedStringData=localAdapter.loadOldRestore()
      }else{
        savedStringData=space.data
      }
      //savedStringData = fs.readFileSync(sessionRestore.savePath, 'utf-8')
    } catch (e) {
      console.warn('无法载入空间，空间数据损毁',e)
      return false
      //console.warn('failed to read session restore data', e)
    }

    return savedStringData

    /*
    Disabled - show a user survey on startup
    // the survey should only be shown after an upgrade from an earlier version
    var shouldShowSurvey = false
    if (savedStringData && !localStorage.getItem('1.15survey')) {
      shouldShowSurvey = true
    }
    localStorage.setItem('1.15survey', 'true')
    */


  }
}

module.exports=localAdapter
