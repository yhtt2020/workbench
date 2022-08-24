const BarrageApi = require('../api/barrageApi')

class BarrageModel{
  api
  constructor () {

  }
  async init(){
    this.api=new BarrageApi()
    this.api.init()
  }
  async add(barrage){
      let rs=await this.api.add(barrage)
    console.log('apirs',rs)

  }
}

module.exports=BarrageModel
