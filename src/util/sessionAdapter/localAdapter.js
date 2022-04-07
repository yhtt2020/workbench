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
  async restore(spaceId){
    ldb.reload()
    var savedStringData
    try {
      let space=ldb.db.get('spaces').find({id:spaceId}).value()
      if(!!!space){
        if(fs.existsSync(localAdapter.oldSavePath)){
          let savedJson=fs.readFileSync(localAdapter.oldSavePath, 'utf-8')
          if(savedJson){
            savedStringData=savedJson
          }
          fs.renameSync(localAdapter.oldSavePath,localAdapter.oldSavePath+'.bak')
        }else{
          return false
        }
      }else{
        savedStringData=JSON.stringify(space.data)
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
