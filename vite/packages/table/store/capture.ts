import {defineStore} from "pinia";
export const captureStore = defineStore("captureStore", {
  state: () => ({
    sources:[]
  }),
  actions:{
    bindCaptureIPC(){
      console.log('绑定capture事件')
      ipc.on('gotRecordSource',(event,args)=>{
        console.log('回传消息=',args)
        this.sources=args.sources
      })
    },
    getSource(){
      ipc.send('getRecordSource')
    }
  }
})
