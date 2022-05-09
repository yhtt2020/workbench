const ipc = require('electron').ipcRenderer

class EventIpc {
  id = 0
  events = new Map

  constructor() {
    ipc.on('ipcEventRemove', (event, args) => {
      const eventObj = this.events.get(args.id)
      if(!eventObj) return
      let newEventName = eventObj.eventName.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
      ipc.removeListener(`reply${newEventName}`, eventObj.eventReplyCallback)
      this.events.delete(args.id);
    })
  }

  dispatch(eventName, options, eventReplyCallback, tsbSdk, eventBusId) {
    this.id += 1
    this.events.set(this.id, {
      eventName,
      eventReplyCallback
    })
    options.id = this.id
    ipc.send(eventName, options)
    let newEventName = eventName.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    ipc.on(`reply${newEventName}`, eventReplyCallback)
    ipc.on('errorOperate', () => {
      tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: {code: 500, msg: `授权窗口已关闭`}, id: eventBusId})
    })
  }
}

module.exports = EventIpc
