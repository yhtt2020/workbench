import ActionExecutor from './actionExecutor'
let isDevelopmentMode= 'development-mode' in window.globalArgs
let path
let arch=require('process').arch
const exec = require('child_process').exec
let workerProcess

if(isDevelopmentMode) {
  path = window.globalArgs['app-path'] + `/res/nir/${arch}/nircmdc.exe`
}else{
  path = window.globalArgs['app-path'] + `/../res/nir/${arch}/nircmdc.exe`
}
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
            message.push(await runExec(`"${path}" `+cleanLines[i],undefined))
          }
          result=1
          break
        case 'cmd':
          for(let i=0;i<cleanLines.length;i++){
            message.push(await runExec(cleanLines[i],undefined))
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


async function runExec(cmdStr,cmdPath) {
  let promise=new Promise((resolve,reject)=>{
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    console.log('执行cmd',cmdStr)
    workerProcess = exec(cmdStr, {cwd: cmdPath})
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
      resolve(data)
    });
//退出之后的输出
    workerProcess.on('close', function (code) {
      resolve(code)
      console.log('out code：' + code);
    })

    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
      reject(data)
    });
  })


  return promise

}

export default CmdAction
