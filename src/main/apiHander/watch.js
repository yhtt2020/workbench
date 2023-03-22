const Base = require('./base')
const ipc = require('electron').ipcMain
const TaskModel = require('../../model/watchTaskModel')
const taskModel = new TaskModel()

class Watch extends Base {
  tasks = []
  taskInstances = [] //任务实例

  taskIntervals = []//计时器

  tests = []

  constructor () {
    super('watch')
  }

  bindIPC () {
    taskModel.initDb().then(() => {
      this.autoRunTasks()
    })
    this.on('addTask', (event, args, instance) => {
      console.log(args)
    })
    this.on('testTask', (event, args, instance) => {
      this.runTest(args.task, instance)
    })
    this.on('stopTask',(event,args,instance)=>{
      this.stopTask(args)
      args.running=false
      event.reply('taskUpdate', { task: args })
    })

    this.on('startTask', (event, args, instance) => {
      console.log(args, '接收到启动任务的命令')
      let task = args
      this.runTask(task, {
        additionalArguments: ['--task-id=' + task.nanoid]
      }).then(async () => {
        await taskModel.startTask(task.nanoid) //修改数据库
        //回传执行的消息
        task.running = true
        event.reply('taskUpdate', { task: task })
      })
    })

    //来自渲染进程
    ipc.on('api.watch.testSuccess', (event, args) => {
      let index = -1
      let tester = this.tests.find((t, i) => {
        index = i
        return String(t.id) === String(args.id)
      })
      if (tester) {
        //回传消息给我们的工作台，并告知测试结果是通过的。
        tester.instance.window.webContents.send('testSuccess', args)
        this.tests.splice(index, 1)
      }
    })

    //来自渲染进程
    ipc.on('api.watch.testFailure', (event, args) => {
      let index = -1
      let tester = this.tests.find((t, i) => {
        return String(t.id) === String(args.id)
      })
      if (tester) {
        tester.instance.window.webContents.send('testFailure', args)
        this.tests.splice(index, 1)
      }
    })
    //todo 返送测试结果
    //todo 删除test
  }

  autoRunTasks () {
    taskModel.listAllTasks().then(tasks => {
      tasks.forEach((task) => {
        if (task.running) {
          this.runTask(task, {
            background: true,
            muted: true,
            additionalArguments: ['--task-id=' + task.nanoid]
          }).then(r => {
            console.log('后台静音执行任务' + task.nanoid)
          })
        }
      })
    })
  }

  /**
   * 执行测试任务
   * @param task
   * @param instance
   * @returns {Promise<void>}
   */
  async runTest (task, instance) {
    this.tests.push(task)
    task.instance = instance

    await this.runTask(task, {
      additionalArguments: [
        '--mod=test',
        '--task-id=' + task.id
      ]
    })
  }

  /**
   * 执行任务，和start不同的是，这个并不会对数据库进行改动，所以可以用于test
   * @param task
   * @param options additionalArguments 额外的参数
   * @returns {Promise<void>}
   */
  async runTask (task, options) {
    let additionalArguments = []
    if (options.additionalArguments) {
      //如果有这个参数就合并进来
      additionalArguments = options.additionalArguments
    }
    let taskPreload = ___dirname + '/src/watchPreload/default.js'
    let name = task.nanoid || task.id   //如果是测试任务，是没有nanoid的，优先使用nanoid
    let taskInstance = await global.windowManager.create({
      name: this.getName(name),
      windowOption: {
        width: 1200,
        height: 1000,
        show: !options.background,
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
    if (options.muted) {
      //设置静音
      window.webContents.setAudioMuted(true)
    }
    window.on('close', (e) => {
      //关闭仅隐藏，除非触发关闭任务
      window.hide()
      e.preventDefault()
    })

    this.taskIntervals[task.nanoid] = setInterval(() => {
      window.webContents.reload()
    }, task.interval * 1000)
    // window.setMenu(null)
    // window.webContents.openDevTools()
    taskInstance.task=task
    this.taskInstances.push(taskInstance)

  }

  async stopTask (task) {
    let taskInstance = this.findInstance(task.nanoid)
    if (taskInstance) {
      console.log(task, '关闭任务')
      let window = taskInstance.window
      window.destroy()//强制关闭
      clearInterval(this.taskIntervals[task.nanoid])//移除定时任务
      this.taskInstances.splice(this.taskInstances.findIndex(t=>{
        //移除instance
        return t.task.nanoid===task.nanoid
      }),1)
      await taskModel.update(task.nanoid, { running: false })
    }
  }

  /**
   * 找到任务实例
   * @param nanoid
   * @returns {*}
   */
  findInstance(nanoid){
    return this.taskInstances.find(t => {
      return t.task.nanoid === nanoid
    })
  }
  getName (name) {
    return 'task.' + name
  }
}

module.exports = Watch
