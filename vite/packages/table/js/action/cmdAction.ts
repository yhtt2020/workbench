import ActionExecutor from './actionExecutor'
import {runNir, runExec, runSoundVolume, runMultiMonitorToolCmd} from '../common/exec'

class CmdAction extends ActionExecutor {
  async doAction ():ActionExecutor {
    let { action, args } = this
    let result = -1
    let lines=args.cm.trim().split('\n')
    let cleanLines=lines.map(line=>{
      const cleanLine=line.trim()
      if(cleanLine==='')
      {
        return false
      }else{
        return cleanLine
      }
    })
    let message=[]
    console.log(cleanLines,'cleanlines')
    try{
      switch (action.name) {
        case 'nircmd':
          for(let i=0;i<=cleanLines.length;i++){
            console.log('do' ,cleanLines[i])
            message.push(await runNir(cleanLines[i]))
          }
          result=1
          break
        case 'cmd':
          for(let i=0;i<cleanLines.length;i++){
            message.push(await runExec(cleanLines[i],undefined))
          }
          result=1
          break
        case 'svcmd':
          for(let i=0;i<cleanLines.length;i++){
            message.push(await runSoundVolume(cleanLines[i]))
          }
          result=1
          break
        case 'mmtcmd':
          for(let i=0;i<cleanLines.length;i++){
            message.push(await runMultiMonitorToolCmd(cleanLines[i]))
          }
          result=1
          break
        case 'exe':
          for(let i=0;i<cleanLines.length;i++){
            message.push(await  runExec(`"${args.exe}" `+cleanLines[i],undefined))
          }
          result=1
          break
        default:

      }
    }catch (e) {
      console.log('执行报错了',e)
      message=e
      result=0
    }

    console.log(message,'message')
    return {
      message:message,
      status: result
    }
  }

}




export default CmdAction
