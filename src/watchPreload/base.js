let $ = require('cash-dom')
let ipc = require('electron').ipcRenderer
let util = require('../util/util')
let t = util.tools.getWindowArgs(window)
let loaded = false//初始化标志，防止反复初始化
const WatchTaskModel = require('../model/watchTaskModel')
const taskModel = new WatchTaskModel()
taskModel.initDb()
const WatchDataModel = require('../model/watchDataModel')
const dataModel = new WatchDataModel()
dataModel.initDb()

class TaskHandler {
  test = {}
  start = {}
  intervals = []

  taskId = ''

  timeouts = []

  constructor (props) {
    this.test = props.test
    this.start = props.start
    this.intervals = props.intervals
    this.taskId = t.globalArgs['task-id']

  }

  async saveData (data, type) {
    console.log('欣然收下采集到的数据', data)
    if (data) {
      await dataModel.add(this.taskId, data, type)
    } else {
      await dataModel.addError(this.taskId, {}, type)
    }
  }

  init () {

    $(() => {
      if (loaded) {
        console.log('已经初始化过了')
        return
      }
      loaded=true
      this.saveData(this.start(), 'start').then()

      if (t.globalArgs.mod === 'test') {
        let data = this.test()
        if (!data) {
          this.testFailure()
        } else {
          this.testSuccess(data)
        }
      }

      if (this.timeouts.length > 0) {
        this.timeouts.forEach(item => {
          setTimeout(() => {
            this.saveData(item.fn, 'timeout').then()
          }, item.timeout)
        })

      }

      this.intervals.forEach(item => {
        //this.saveData(item.fn(), 'interval').then()
        setInterval(() => {
          this.saveData(item.fn(), 'interval').then()
        }, item.interval)
      })
    })
  }

  testSuccess (data) {
    ipc.send('api.watch.testSuccess', { data, id: t.globalArgs['task-id'] })
  }

  testFailure () {
    ipc.send('api.watch.testFailure', { id: t.globalArgs['task-id'] })
  }

}

const utils = {
  clean (text) {
    return text.replaceAll(/\ +/g, '').replaceAll(/[\r\n]/g, '')
  }
}

module.exports = { TaskHandler, utils }
