const settings = require('../../js/util/settings/settings.js')
const { nanoid }=require('nanoid')
const clientModel={
  get(){
    let client={id:'',name:''}
    client.id= settings.get('clientID')
    client.name=settings.get('clientName')
    if(!client.name){
      try{
        client.name=require('os').hostname()
      }catch (e) {
        console.warn('取不到计算机名',e)
        client.name='计算机'+nanoid(4)
        settings.set('clientName',client.name)
      }
    }
    return client
  }
}

module.exports=clientModel
