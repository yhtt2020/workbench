const settings = require('../../js/util/settings/settings.js')

const clientModel={
  get(){
    let client={id:'',name:''}
    client.id= settings.get('clientID')
    client.name=settings.get('clientName')
    if(!client.name){
      client.name=require('os').hostname()
    }
    return client
  }
}

module.exports=clientModel
