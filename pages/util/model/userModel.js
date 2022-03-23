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
  }
}

module.exports=userModel
