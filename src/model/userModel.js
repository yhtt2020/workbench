const db = require('../../js/util/database.js').db
const userModel={
  async getAll(){
    let users=await db.accounts.toArray()
    users.forEach(user=>{
      if(!!!user.spaces){
        user.spaces=[]
      }
    })
    return users
  },
  async get(map){
    if(map.id){
      map.id=Number(map.id)
    }
    let user=await db.accounts.where(map).first()
    if(user){
      if(!!!user.spaces){
        user.spaces=[]
      }
      return user
    }else{
      return false
    }
  },

  getClientId(){
    const settings=require('../../js/util/settings/settings.js')
    console.log(window.globalArgs['user-data-path'] + (process.platform === 'win32' ? '\\' : '/') + 'settings.json')
    console.log(settings.list)
    return settings.get('clientID')
  },

  async delete(map){
    return await db.accounts.where(map).delete(map)
  }
}

module.exports=userModel
