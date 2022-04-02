const cloudSpaceModel = require('../../../src/model/cloudSpaceModel')
const standReturn = require('../../../src/util/standReturn')
if(window){
  ldb=window.ldb
}
const cloudAdapter={
  name:'cloudAdapter',
  userToken:'',
  previousState: null,
  adapter:null,

  async save(spaceId,saveData){
    ldb.reload()
    try{
      let userInfo=ldb.db.get('currentSpace.userInfo').value()
      let result=await cloudSpaceModel.save(spaceId,saveData,userInfo,false)
      console.log(result)
      if(result.status===1){
        console.log('自动备份到云端')
        console.log(result)
        if(result.data==='-1'){
          //todo 空间不存在
        }
        if(result.data==='-2'){
          //todo 保存失败，冲突
          ipc.send('showUserWindow',{conflict:true,modal:true})
          console.log('fail',result)
        }
      }else{

        //保存失败，冲突
        return standReturn.failure('',result.data)
      }
    }catch (e) {


      console.log(e)
    }


  },
  async restore(spaceId){
    ldb.reload()
    var savedStringData
    try {
      let userInfo=ldb.db.get('currentSpace.userInfo').value()
      let result =await cloudSpaceModel.restore(spaceId,userInfo)
      console.log('获得远端恢复返回',result)
      if(result.status===1){
        savedStringData=JSON.stringify(result.data.data)
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

module.exports=cloudAdapter
