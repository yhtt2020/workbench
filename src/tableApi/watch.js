const ipcHelper = require('../browserApi/ipcHelper')
const WatchTaskModel = require('../model/watchTaskModel')
const DataModel = require('../model/watchDataModel')
const taskModel = new WatchTaskModel()
taskModel.initDb()
const dataModel = new DataModel()
dataModel.initDb()

function send (channel, args = {}) {
  ipcHelper.send('watch', channel, JSON.parse(JSON.stringify(args)))
}

async function sendSync (channel, args = {}) {
  return await ipcHelper.sendSync('watch', channel, args)
}

let tasks = []
let tests = []//测试，测完即弃

let onTaskUpdate

const watch = {

  /**
   * 设置任务状态更新handler用于执行回调
   * @param cb
   */
  setTaskUpdateHandler (cb) {
    onTaskUpdate = cb
  },

  async startTask (task) {
    send('startTask', task)
  },

  async stopTask(task){
    send('stopTask', task)
  },
  async addTask (task, start = false) {
    return await taskModel.add(task)
  },

  /**
   * 获取到最新的任务信息，如果是重复的，则返回null 否则，返回一个包含data和last_execute_info的对象。
   * @param task
   * @returns {Promise<void>}
   */
  async getLatestData (task) {
    let gotData = await dataModel.getLatestStart(task.nanoid)
    let returnValue = {
      data: null,
      last_execute_info: null
    }
    if (gotData) {
      try {
        if (task.last_execute_info) {
          if (task.last_execute_info.grab_time === gotData.grab_time) {
            console.log('同一抓取时间，返回null')
            return null
          }
        }
        returnValue.data = JSON.parse(gotData.data)
        returnValue.last_execute_info = gotData
        console.log(task.data, '更新成功')
        return returnValue
      } catch (e) {
        console.warn('数据转换失败', e)
      }
      return returnValue
    }
  },

  async getTask(map){
    let task =await taskModel.get(map)
    let lastInfo = await watch.getLatestData(task)
    if (lastInfo) {
      task.data = lastInfo.data
      task.last_execute_info = lastInfo.last_execute_info
    }
    return task
  },

  async listAllTasks () {
    let tasks = await taskModel.listAllTasks()
    for (const task of tasks) {
      let lastInfo = await watch.getLatestData(task)
      if (lastInfo) {
        task.data = lastInfo.data
        task.last_execute_info = lastInfo.last_execute_info
      }
      console.log('获取到任务的封面数据', task.data)
    }
    return tasks
  },
  /**
   * 测试任务，尝试获取回采集的数据，一般用于前台进行首次采集的测试，防止无法真正实现采集而导致添加错误任务。
   * @param task
   * @param onSuccess
   * @param onFailure
   * @param onTimeout
   * @param timeout
   * @returns {Promise<any>}
   */
  testTask (task, onSuccess, onFailure, onTimeout, timeout = 10) {
    tests.push(task)
    task.onSuccess = onSuccess
    task.onFailure = onFailure
    task.onTimeout = onTimeout
    setTimeout(() => {
      console.log('检测超时')
      let index = -1
      let tester = tests.find((t, i) => {
        if (String(t.id) === String(task.id)) {
          index = i
          return true
        }
      })
      if (tester) {
        if (onTimeout) {
          onTimeout()
        }
        tests.splice(index, 1)
      } else {
        console.log('任务早已返回')
      }
    }, timeout * 1000)
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

ipc.on('taskUpdate', (event, args) => {
  if (onTaskUpdate) {
    console.log('任务状态更新')
    onTaskUpdate(args.task)
  }
})

module.exports = watch
