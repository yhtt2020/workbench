const ipcHelper = require('../browserApi/ipcHelper')

function send (channel, args = {}) {
  ipcHelper.send('watch', channel, args)
}

async function sendSync (channel, args = {}) {
  return await ipcHelper.sendSync('watch', channel, args)
}

let tasks = []
let tests = []//测试，测完即弃

const watch = {

  async addTask (task) {
    return await send('addTask', { task })
  },
  /**
   * 测试任务，尝试获取回采集的数据，一般用于前台进行首次采集的测试，防止无法真正实现采集而导致添加错误任务。
   * @param task
   * @param onSuccess
   * @param onFailure
   * @param onTimeout
   * @returns {Promise<any>}
   */
  testTask (task, onSuccess, onFailure, onTimeout, timeOut = 10) {
    tests.push(task)
    task.onSuccess = onSuccess
    task.onFailure = onFailure
    task.onTimeout = onTimeout
    setTimeout(() => {
      console.log('检测超时')
      let index=-1
      let tester=tests.find((t,i)=>{
        if(String(t.id)===String(task.id)){
          index=i
          return true
        }
      })
      if(tester){
        if(onTimeout){
          onTimeout()
        }
        tests.splice(index,1)
      }else{
        console.log('任务早已返回')
      }
    }, timeOut * 1000)
    send('testTask', { task: JSON.parse(JSON.stringify(task)) })
  }
}
ipc.on('testSuccess', (event, args) => {
  let index
  let test = tests.find((t, i) => {
    if (String(t.id) === String(args.id)) {
      index = i
      return true
    }
  })
  if (test) {
    if (test.onSuccess) {
      console.log('回调测试成功结果')
      test.onSuccess(args)
    }
    tests.splice(index)
  }

})
ipc.on('testFailure', (event, args) => {
  let index
  console.log(tests)
  let test = tests.find((t, i) => {
    if (String(t.id) === String(args.id)) {
      index = i
      return true
    }
  })
  if (test) {
    if (test.onFailure) {
      console.log('回调测试失败结果')
      test.onFailure(args)
    }
    tests.splice(index)
  }

})

module.exports = watch
