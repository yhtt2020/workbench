
const mouseApi = {
   getPos(){
    let pos= require('hmc-win32').getMouseMovePoints()
     return pos[0]
   }
}



module.exports=mouseApi
