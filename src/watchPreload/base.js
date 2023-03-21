let $ = require('cash-dom')
let ipc=require('electron').ipcRenderer
let util=require('../util/util')
let t=util.tools.getWindowArgs(window)
class TaskHandler {
  test = {}
  start = {}
  intervals = []

  taskId=''

  constructor (props) {
    this.test = props.test
    this.start = props.start
    this.intervals = props.intervals
    this.taskId=t.globalArgs['task-id']

  }

  init () {

    $(() => {
      this.start()
      if(t.globalArgs.mod==='test'){
        let data= this.test()
        if(!data){
          this.testFailure()
        }else{
          this.testSuccess(data)
        }
      }


      if (this.timeOuts) {
        this.timeOuts.forEach(item => {

          setTimeout(item.fn, item.timeOut)
        })

      }

      this.intervals.forEach(item => {
        item.fn()
        setInterval(item.fn, item.interval)
      })
    })
  }

  testSuccess(data){
    ipc.send('api.watch.testSuccess',{data,id:t.globalArgs['task-id']})
  }

  testFailure(){
    ipc.send('api.watch.testFailure',{id:t.globalArgs['task-id']})
  }

}

const utils = {
  clean (text) {
    return text.replaceAll(/\ +/g, '').replaceAll(/[\r\n]/g, '')
  }
}

module.exports = { TaskHandler, utils }
