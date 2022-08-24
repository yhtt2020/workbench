const BarrageApi = require('../api/barrageApi')
const standReturn = require('../util/standReturn')

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
    if(rs.code===1000){
     return standReturn.success(barrage)
    }else{
      return standReturn.failure()
    }
  }
}

module.exports=BarrageModel
