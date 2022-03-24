const db = require('../../../js/util/database.js').db
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

  async delete(map){
    let result=await db.accounts.delete(map)
    return result
  }


}

module.exports=userModel
