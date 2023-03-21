const Base = require('./base')
const ipc = require('electron').ipcMain

class Watch extends Base {
  tasks = []
  taskInstances = [] //任务实例

  tests = []

  constructor () {
    super('watch')
  }

  bindIPC () {
    this.on('addTask', (event, args, instance) => {
      console.log(args)

    })
    this.on('testTask', (event, args, instance) => {
      this.runTest(args.task,instance)
    })

    //来自渲染进程
    ipc.on('api.watch.testSuccess', (event, args) => {
      let index=-1
      let tester = this.tests.find((t,i) => {
        index=i
        return String(t.id) === String(args.id)
      })
      if(tester){
        //回传消息给我们的工作台，并告知测试结果是通过的。
        tester.instance.window.webContents.send('testSuccess',args)
        this.tests.splice(index,1)
      }
    })

    //来自渲染进程
    ipc.on('api.watch.testFailure', (event, args) => {
      let index=-1
      let tester = this.tests.find((t,i) => {
        return String(t.id) === String(args.id)
      })
      if(tester){
        tester.instance.window.webContents.send('testFailure',args)
        this.tests.splice(index,1)
      }
    })
    //todo 返送测试结果
    //todo 删除test
  }

  async runTest (task,instance) {
    this.tests.push(task)
    task.instance=instance

    await this.runTask(task, [
      '--mod=test',
      '--task-id=' + task.id
    ])
  }

  async runTask (task, additionalArguments = []) {
    let taskPreload = ___dirname + '/src/watchPreload/default.js'
    let taskInstance = await global.windowManager.create({
      name: this.getName(task.id),
      windowOption: {
        width: 1200,
        height: 1000,
        show: true,
        frame: true
      },
      webPreferences: {
        preload: true ? ___dirname + '/src/watchPreload/' + 'bili.js' : taskPreload, //默认使用tsApi
        sandbox: false,
        partition: 'persist:webcontent',
        webSecurity: false,
        additionalArguments: [
          '--app-type=watch',//添加控制台参数,
          ...additionalArguments
        ]
      },
      url: task.url
    })
    let window = taskInstance.window

    window.webContents.openDevTools()
    this.taskInstances.push(taskInstance)

  }

  getName (name) {
    return 'task.' + name
  }
}

module.exports = Watch
