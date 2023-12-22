const { screen} = require('@electron/remote')

const mouseApi = {
   getPos(){
    return screen.dipToScreenPoint(screen.getCursorScreenPoint())
   }
}



module.exports=mouseApi
