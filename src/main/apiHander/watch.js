const Base=require('./base')

class Watch extends Base{
  constructor () {
    super('watch')
  }
  bindIPC(){
    this.on('addTask',(event,args,instance)=>{
        console.log(args)
    })
  }
}
module.exports=Watch
