import {defineStore} from "pinia";
import {setSupervisoryData,getSysStats,IDisplayData} from '../js/action/supervisory'
import dbStorage from "./dbStorage";
import audio from "../js/common/audio";
import { completeTask } from "../apps/task/page/branch/task"


const readAida64 = window.readAida64
const {rpc}=window.$models
// @ts-ignore
export const inspectorStore = defineStore(
  "inspectorStore",
  {
    state: () => {

      return {
        audioTest:0,//音频测试

        aidaData:{},
        frequent:2,//2秒更新一次
        running:false,
        runAida64:false,
        dataSource: 'aida',//aida 或者 python 默认aida
        displayData: {
          useGPU: 0,
          useCPU: 0,
          warmGPU:0,
          warmCPU:0,
          useMemory: 0,
          FPS: 0,
          down: 0,
          up: 0
        } as IDisplayData,
        inspectorTimer: null,//定时器
      }
    },
    actions: {
      setDisplayData(data: IDisplayData) {
        console.log(data)
        let filteredData={}
          Object.keys(data).map(key=>{
          return filteredData[key]=Number(data[key]?.value?data[key]?.value:data[key])
        })
        console.log(filteredData)
        this.displayData = filteredData;
      },
      setDisplayValue(key, value) {
        this.displayData[key] = value
      },
      startInspect() {
        if(this.running){
          return
        }
        this.running=true
        if (this.dataSource === 'aida') {
          this.setupAida()
        } else {
          this.setupPython() //todo 还需手动开启
        }
      },
      setupPython() {
        //todo 运行python脚本
        console.log('启动python数据源')
        this.inspectorTimer = setInterval(async () => {
          try{
            try{
              //let fps = await rpc.inspector.getFPS()
             // this.setDisplayValue('FPS', {value: fps})
            }catch (e) {

            }


          }catch (e) {
            console.warn('FPS服务未启动')
          }

          getSysStats().then(data=>{
            this.setDisplayData(data)
          })

        }, this.frequent*1000)
      },
      setupAida() {
        //根据当前选择数据源，启动定时器
        this.inspectorTimer = setInterval(() => {
          readAida64()
            .then((res) => {
              // 性能捕获 支线任务点
              completeTask('Z0106')
              this.runAida64 = true;
              const newData = setSupervisoryData(res);
              this.aidaData=res
              this.setDisplayData(newData);
              // console.log(res)
              //this.data=JSON.stringify(res, null, '\t')
            })
            .catch((err) => {
              this.runAida64 = false;
              clearInterval(this.inspectorTimer);
              this.reserveTimer = setInterval(() => {
                readAida64()
                  .then((res) => {
                    this.runAida64 = true;
                    clearInterval(this.reserveTimer);
                    this.startAida();
                  })
                  .catch((err) => {
                  });
              }, 10000);
              const newData = setSupervisoryData(undefined);
              this.setDisplayData(newData);
            });
        }, this.frequent*1000);
      },
      stopInspect() {
        //终止定时器
        if (this.inspectorTimer) {
          clearInterval(this.inspectorTimer);
          this.inspectorTimer=null
          console.log('成功清理计时器')
          this.running=false
        }
      },
      startListenAudioTest(){
        audio.startListen((vol)=>{
          console.info('更新数据')
          this.audioTest=vol
        },()=>{
          console.info('监听成功')
        },
          ()=>{
          console.warn('监听失败')
          })
      },
      stopListenerAudioTest(){
        audio.disconnect()
      }
    },
    persist: {
      enabled: true,
      strategies: [{
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths:['frequent','dataSource'],
        storage: localStorage,
        // state 中的字段名，按组打包储存
      }]
    }
  }
)
