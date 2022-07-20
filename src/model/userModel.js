const crypto = require('crypto')
const db = require('../../js/util/database.js').db
if (typeof window !=='undefined') {
  ldb = window.ldb
}
const userModel={

  async getAll(){
    ldb.reload()
    let users=await db.accounts.toArray()
    users.forEach(item=>{
      let userLdb=ldb.db.get('users').find({uid:item.uid}).value()
      Object.assign(item,userLdb)
    })

    return users
  },
  async get(map){
    if(map.id){
      map.id=Number(map.id)
    }
    if(map.uid){
      map.uid=Number(map.uid)
    }
    let user=await db.accounts.where(map).first()
    if(user){
     ldb.reload()
      let userLdb=ldb.db.get('users').find({uid:map.id}).value()
      user=Object.assign(user,userLdb)
      return user
    }else{
      return false
    }
  },
  async change(user){
    await db.system.where({ name: 'currentUser' }).delete()
    user=JSON.parse(JSON.stringify(user))
    await db.system.put({
      name: 'currentUser',
      value: user
    })
  },

  getClientId(){
    const settings=require('../../js/util/settings/settings.js')
    return settings.get('clientID')
  },

  async delete(map){
    ldb.reload()
    ldb.db.get('users').remove({uid:map.uid}).write()
    return await db.accounts.where(map).delete(map)
  },
  sha(text){
    const crypto = require('crypto')
    const sha = crypto.createHash('sha1')
    sha.update(text);
    return sha.digest('hex')
  },

  setEnterPwd(enterPwd,uid){
    ldb.reload()
    let user=ldb.db.get('users').find({uid:uid}).value()
    if(enterPwd!==''){
      enterPwd=userModel.sha(enterPwd)
    }
    if(!!!user){
      ldb.db.get('users').push({
        id:uid,
        uid:uid,
        enterPwd:enterPwd
      }).write()
    }else{
      ldb.db.get('users').find({uid:uid}).assign({'enterPwd':enterPwd}).write()
    }
  },

  compareEnterPwd(pwd,uid){
    ldb.reload()
    let pwdSha= userModel.sha(pwd)
    let user =ldb.db.get('users').find({uid:uid}).value()
    return user.enterPwd === pwdSha
  }
}

module.exports=userModel
