const cloudSpaceModel = require('../../../src/model/cloudSpaceModel')
const standReturn = require('../../../src/util/standReturn')
if(window){
  ldb=window.ldb
}
function fatal(option){
  return standReturn.failure({action:'fatal',option:option})
}

function disconnect(option){
  return standReturn.failure({action:'disconnect',option:option})
}

function noAction(data){
  return standReturn.failure({action:'none',option:data})
}


const cloudAdapter={
  name:'cloudAdapter',
  userToken:'',
  previousState: null,
  adapter:null,
  async save(spaceId,saveData){
    ldb.reload()
    try{
      let userInfo=null //用户信息，用于发起api请求
      try{
        var backupSpace=ldb.db.get('spaces').find({id:spaceId}).value()
        if(backupSpace.userInfo){
          //如果空间当时存了用户信息，则赋值过去
          userInfo=backupSpace.userInfo
        }
      }catch (e) {
        console.warn('无法从space中获取到用户信息')
        console.log(backupSpace)
      }
      //如果上一步没有获取到用户信息
     if(!!!userInfo){
        //如果当时没有存下用户信息，就获取当前空间的用户信息
       try{
         var currentUser=ldb.db.get('currentSpace.userInfo').value()
         if(currentUser){
           userInfo=currentUser //如果是本地用户了，那也确认丢失了
           ldb.db.get('spaces').find({id:spaceId}).assign({userInfo:userInfo}).write()
         }
       }catch (e) {
         console.warn('无法从本地当前用户中中获取到用户信息')
         console.log(currentUser)
       }
      }
      if(!!!userInfo){
        //如果两边都无法获取到，确认是丢失了用户数据
        return standReturn.failure('无法获得保存用户凭证导致存储失败。')
      }

      try{
        let result=await cloudSpaceModel.save(spaceId,saveData,userInfo,false)
        if(result.status===1){
          console.log('自动备份到云端')
          console.log(result)
          if(result.data==='-1'){
            //todo 空间不存在
            console.warn('fail','远端空间不存在，导致存储失败')
            console.log(saveData)
            return fatal({modal:true,title:'无法成功保存空间',description:'云端空间已不存在。',fatal:true})
          }
          if(result.data==='-2'){
            //todo 保存失败，冲突
            console.warn('fail','设备冲突导致云端存储失败')
            console.log(saveData)
            return fatal({modal:true,title:'无法成功保存空间',description:'云端空间已被其他设备抢占，当前空间已无法存入。',fatal:true})
          }
        }else{
          //保存失败，冲突
          noAction(result.data)
        }
      }catch (e) {
        console.warn('存储到云端失败，接口请求失败。')
        console.log(e)
        return disconnect({modal:true,title:'无法连接',description:'无法连接云端。',disconnect:true})
      }
    }catch (e) {
      console.log(e)
      console.warn('云端存储全局意外错误返回')
      return standReturn.failure('云端存储全局意外错误返回')
    }
    return standReturn.success('成功保存至云端，保存时间：'+new Date(Date.now()).toLocaleString())
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
