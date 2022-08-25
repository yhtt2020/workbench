const { SqlDb }=require('../util/sqldb')
const standReturn = require('../util/standReturn')
let sqlDb=new SqlDb()
const userModel={

  /**
   * 获取全部账号，已sqldb
   * @returns {Promise<*>}
   */
  async getAll(){
    let accounts=await sqlDb.knex('account').select()
    accounts.forEach(user=>{
      user['user_info']=JSON.parse(user.user_info)
    })
    return accounts
  },

  /**
   * 设置当前用户，sqldb
   * @param user
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: *}>}
   */
  async setCurrent(user){
    /** uid:responseData.uid,
     code:responseData.code,
     token:responseData.token,
     refresh_token:responseData.refreshToken,
     user_info:responseData.userInfo,
     expire_time:new Date().getTime() + responseData.expire * 1000,
     refresh_expire_time: new Date().getTime() + responseData.refreshExpire * 1000,
     last_login_time:Date.now(),
     is_current:true*/
    try{


    let found=await sqlDb.knex('account').where({uid:user.uid}).first()
    await sqlDb.knex('account').where({is_current: true}).update({is_current: false}) //重置所有的当前用户
    let res
    if(!found){
     res=await sqlDb.knex('account').insert(user)
    }else{
      if(typeof user.user_info ==='object'){
        user.user_info=JSON.stringify(user.user_info)
      }
     res= await sqlDb.knex('account').where({uid:user.uid}).update(user)
    }
    if(res){
      return standReturn.success(user,'更新成功')
    }
    }catch (e) {
      return standReturn.failure(e,'更新失败')
    }
  },
  /**
   * 获取当前用户 sqldb
   * @returns {Promise<void>}
   */
  async getCurrent(){
    let found
      try{
      found=await sqlDb.knex('account').where({is_current: true}).first()
      }catch (e) {
        return standReturn.failure({},'数据库错误')
      }
    if(found){
      found.user_info=JSON.parse(found.user_info)
      return standReturn.success(found,'')
    }else{
      return standReturn.failure({},'不存在当前的登录用户')
    }


  },

  /**
   * 获取用户，sqldb
   * @param map
   * @returns {Promise<*|boolean>}
   */
  async get(map){
    if(map.uid){
      map.uid=Number(map.uid)
    }
    let user=await sqlDb.knex('account').where(map).first()
    if(user){
      if(user.user_info)
       user.user_info=JSON.parse(user.user_info)
      return user
    }else{
      return false
    }
  },
  /**
   * 修改当前用户 sqldb
   * @param user
   * @returns {Promise<void>}
   */
  async change(user){
    await sqlDb.knex('account').where({is_current:true}).update({is_current:false})
    await sqlDb.knex('account').where({uid:user.uid}).update({is_current:true})
  },
  /**
   * 切换到本地空间
   * @returns {Promise<void>}
   */
  async logout(){
    await sqlDb.knex('account').where({is_current:true}).update({is_current:false})
  },

  getClientId(){
    const settings=require('../../js/util/settings/settings.js')
    return settings.get('clientID')
  },

  /**
   *删除某个用户 sqldb
   * @param map
   * @returns {Promise<*>}
   */
  async delete(map){
    return await sqlDb.knex('account').where(map).delete()
  },

  /**
   * 是否已登录，>=1为已登录
   * @returns {Promise<*>}
   */
  async isLogged(){
    return (await sqlDb.knex('account').where({'is_current':true}).select()).length>=1
  },

  sha(text){
    const crypto = require('crypto')
    const sha = crypto.createHash('sha1')
    sha.update(text);
    return sha.digest('hex')
  },

  /**
   * 设置密码 sqldb
   * @param enterPwd
   * @param uid
   * @returns {Promise<boolean>}
   */
  async setEnterPwd (enterPwd, uid) {
    let user = await sqlDb.knex('account').where({ uid: uid }).first()
    let pwd=null
    if(enterPwd!==''){
      pwd=userModel.sha(enterPwd)
    }
    if(!!!user){
      return false
    }else{
      await sqlDb.knex('account').where({uid:uid}).update({password:pwd})
    }
  },

  /**
   * 比对密码 sqldb
   * @param pwd
   * @param uid
   * @returns {boolean}
   */ async compareEnterPwd (pwd, uid) {
    let pwdSha = userModel.sha(pwd)
    let user = await sqlDb.knex('account').where({ uid: uid, password: pwdSha }).first()
    if (!!!user) {
      return false
    } else {
      return true
    }
  }
}

module.exports=userModel
