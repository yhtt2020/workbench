const Base = require('./base')
const ipc = require('electron').ipcMain
const WatchModel=require('../../model/watchTaskModel')
const watchModel=new WatchModel()


class Watch extends Base {
  tasks = []
  taskInstances = [] //任务实例

  tests = []

  constructor () {
    super('watch')
  }


  bindIPC () {
    watchModel.initDb().then()
    this.on('addTask', (event, args, instance) => {
      console.log(args)
    })
    this.on('testTask', (event, args, instance) => {
      this.runTest(args.task,instance)
    })


    this.on('startTask',(event,args,instance)=>{
      console.log(args,'接收到启动任务的命令')
      let task=args
      this.runTask(task,[ '--task-id=' + task.nanoid]).then(async () => {
        await watchModel.startTask(task.nanoid) //修改数据库
        //回传执行的消息
        task.running=true
        event.reply('taskUpdate',{task:task})
      })
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

  /**
   * 执行测试任务
   * @param task
   * @param instance
   * @returns {Promise<void>}
   */
  async runTest (task,instance) {
    this.tests.push(task)
    task.instance=instance

    await this.runTask(task, [
      '--mod=test',
      '--task-id=' + task.id
    ])
  }

  /**
   * 执行任务，和start不同的是，这个并不会对数据库进行改动，所以可以用于test
   * @param task
   * @param additionalArguments
   * @returns {Promise<void>}
   */
  async runTask (task, additionalArguments = []) {
    let taskPreload = ___dirname + '/src/watchPreload/default.js'
    let name=task.nanoid || task.id   //如果是测试任务，是没有nanoid的，优先使用nanoid
    let taskInstance = await global.windowManager.create({
      name: this.getName(name),
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
   // window.setMenu(null)
   // window.webContents.openDevTools()
    this.taskInstances.push(taskInstance)

  }

  getName (name) {
    return 'task.' + name
  }
}

module.exports = Watch
